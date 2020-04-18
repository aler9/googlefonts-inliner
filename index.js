
const postcss = require('postcss');
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

const httpGetAsync = async (url, options) => new Promise((done, reject) => {
  const ur = new URL(url);
  const req = https.request({
    hostname: ur.host,
    path: ur.pathname + ur.search,
    ...options,
  }, (res) => {
    let cnt = Buffer.alloc(0);
    res.on('data', (data) => {
      cnt = Buffer.concat([cnt, data]);
    });
    res.on('end', () => done(cnt));
  });
  req.on('error', (err) => reject(err));
  req.end();
});

module.exports = postcss.plugin('googlefonts-inliner', (inOptions) => {
  let options = inOptions || {};
  options = {
    localPath: './googlefonts',
    webPath: 'googlefonts',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X)'
      + ' AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/63.0.3239.73 Mobile/14G60 Safari/602.1',
    ...options,
  };

  return async (root) => {
    // create output folder
    await mkdir(options.localPath);

    // gather @import rules
    const rules = [];
    root.walkAtRules('import', (rule) => rules.push(rule));

    await Promise.all(rules.map(async (rule) => {
      // match google fonts
      const matches = rule.params.match(/^url\(["'](https:\/\/fonts\.googleapis\.com.+?)["']\)$/);
      if (!matches) {
        return;
      }

      // download and parse font css
      let fontRoot = await httpGetAsync(matches[1], {
        headers: {
          'User-Agent': options.userAgent,
        },
      });
      fontRoot = postcss.parse(fontRoot.toString());

      // gather @font-face/src declarations
      const fdecls = [];
      fontRoot.walkAtRules('font-face',
        (frule) => frule.walkDecls('src',
          (fdecl) => fdecls.push(fdecl)));

      await Promise.all(fdecls.map(async (fdecl) => {
        // for each font url
        const value = await replaceAsync(fdecl.value, /url\((https:\/\/.+\/(.+?))\)/g, async (fmatches) => {
          // download font
          const font = await httpGetAsync(fmatches[1], {});

          // save font
          await writeFile(join(options.localPath, fmatches[2]), font);

          // replace font url with local url
          return `url(${options.webPath}/${fmatches[2]})`;
        });

        // replace value with modified value
        fdecl.replaceWith({
          prop: 'src',
          value,
        });
      }));

      // replace @import with font css
      rule.replaceWith(fontRoot);
    }));
  };
});
