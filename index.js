
const { resolve, dirname, join } = require('path');
const https = require('https');
const { promisify } = require('util');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
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

module.exports = async (inOptions) => {
  const options = {
    file: null,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X)'
      + ' AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/63.0.3239.73 Mobile/14G60 Safari/602.1',
    ...inOptions,
  };

  const folderPath = dirname(resolve(options.file));

  // read stylesheet
  let cnt = await readFile(options.file, 'utf-8');

  // create fonts folder
  await mkdir(join(folderPath, 'googlefonts'));

  // foreach font url
  cnt = await replaceAsync(cnt, /@import url\(["'](https:\/\/fonts\.googleapis\.com.+?)["']\);/g, async (ma) => {
    // download font css
    let fontCss = await httpGetAsync(ma[1], {
      headers: {
        'User-Agent': options.userAgent,
      },
    });
    fontCss = fontCss.toString();

    // foreach font
    fontCss = await replaceAsync(fontCss, /url\((https:\/\/.+\/(.+?))\)/g, async (mb) => {
      // download font
      const font = await httpGetAsync(mb[1], {});

      // save font
      await writeFile(join(folderPath, 'googlefonts', mb[2]), font);

      return `url(googlefonts/${mb[2]})`;
    });

    // replace font url with font css
    return fontCss.replace(/\n$/, '');
  });

  await writeFile(options.file, cnt);
};
