const https = require('https');
const { promisify } = require('util');
const fs = require('fs');
const { join } = require('path');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const replaceAsync = async (str, regex, cb) => {
  const promises = [];
  str.replace(regex, (...m) => promises.push(cb(m)));
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
};

const httpGetAsync = async (url, opts) => new Promise((done, reject) => {
  const ur = new URL(url);
  const req = https.request({
    hostname: ur.host,
    path: ur.pathname + ur.search,
    ...opts,
  }, (res) => {
    if (res.statusCode !== 200) {
      reject(new Error(`bad status code: ${res.statusCode.toString()}`));
      return;
    }

    let cnt = Buffer.alloc(0);

    res.on('data', (data) => {
      cnt = Buffer.concat([cnt, data]);
    });

    res.on('end', () => done(cnt));
  });
  req.on('error', (err) => reject(err));
  req.end();
});

const run = async (opts, root, postcss) => {
  const httpOpts = {
    headers: {
      Connection: 'keep-alive',
      'User-Agent': opts.userAgent,
    },
  };

  // create output folder
  await mkdir(opts.localPath, { recursive: true });

  // gather @import rules
  const rules = [];
  root.walkAtRules('import', (rule) => rules.push(rule));

  // for each import rule
  await Promise.all(rules.map(async (rule) => {
    const matches = rule.params.match(/^url\(["'](https:\/\/fonts\.googleapis\.com.+?)["']\)$/);

    // skip non-google fonts
    if (!matches) {
      return;
    }

    // download font css
    let fontRoot;
    try {
      fontRoot = await httpGetAsync(matches[1], httpOpts);
    } catch (err) {
      rule.warn(postcss.result, `unable to download font: ${err.toString()}`);
      return;
    }

    // parse font css
    fontRoot = postcss.parse(fontRoot.toString());

    // gather @font-face/src declarations
    const fdecls = [];
    fontRoot.walkAtRules('font-face',
      (frule) => frule.walkDecls('src',
        (fdecl) => fdecls.push(fdecl)));

    // for each @font-face/src
    await Promise.all(fdecls.map(async (fdecl) => {
      // replace font url with local url
      let value = await replaceAsync(fdecl.value, /url\((https:\/\/.+\/(.+?))\)/g, async (fmatches) => {
        // download font
        const font = await httpGetAsync(fmatches[1], httpOpts);

        // remove query
        let fname = fmatches[2];
        const i = fname.indexOf('?');
        if (i >= 0) {
          fname = fname.slice(0, i);
        }

        // save font
        await writeFile(join(opts.localPath, fname), font);

        return `url(${opts.webPath}/${fname})`;
      });

      // remove local fonts
      value = value.replace(/local\(.*?\)(, )?/g, '');

      // replace src
      fdecl.replaceWith({
        prop: 'src',
        value,
      });
    }));

    // replace @import with font css
    rule.replaceWith(fontRoot);
  }));
};

module.exports = (inOpts = {}) => {
  const opts = {
    localPath: './googlefonts',
    webPath: 'googlefonts',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X)'
    + ' AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/63.0.3239.73 Mobile/14G60 Safari/602.1',
    ...inOpts,
  };

  return {
    postcssPlugin: 'googlefonts-inliner',
    async Root(root, postcss) {
      await run(opts, root, postcss);
    },
  };
};
module.exports.postcss = true;
