const mock = require('mock-fs');
const postcss = require('postcss');
const { promisify } = require('util');
const fs = require('fs');
const childProcess = require('child_process');

const exec = promisify(childProcess.exec);
const readFile = promisify(fs.readFile);

const plugin = require('.');

afterEach(async () => {
  mock.restore();
});

test('git version match package version', async () => {
  const nodeTag = process.env.npm_package_version;
  const gitTag = (await exec('git describe --tags --abbrev=0')).stdout.slice(1, -1);
  expect(gitTag).toEqual(nodeTag);
});

test('main', async () => {
  mock({});

  const cnt = `
@import url('https://fonts.googleapis.com/css?family=Muli:200,300,400,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Cutive+Mono&display=swap');
@import url(https://example.com/othersheet.css);
body {
  background: blue;
}`;

  const res = await postcss([plugin({
    localPath: '/testfolder',
  })]).process(cnt, { from: undefined });

  expect(res.warnings()).toHaveLength(0);

  expect(res.css).toEqual(`/* vietnamese */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk40eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk50eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk30eifxHiD.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFmQkEk40eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFmQkEk50eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFmQkEk30eifxHiD.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFnOkEk40eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFnOkEk50eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFnOkEk30eifxHiD.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFkpl0k40eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFkpl0k50eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFkpl0k30eifxHiD.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Cutive Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(googlefonts/m8JWjfRfY7WVjVi2E-K9H6RMTm6o39ucNvc.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Cutive Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(googlefonts/m8JWjfRfY7WVjVi2E-K9H6RCTm6o39uc.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@import url(https://example.com/othersheet.css);
body {
  background: blue;
}`);

  expect(await readFile('/testfolder/7Aulp_0qiz-aVz7u3PJLcUMYOFmQkEk30eifxHiD.woff2')).not.toBe(null);
  expect(await readFile('/testfolder/m8JWjfRfY7WVjVi2E-K9H6RCTm6o39uc.woff2')).not.toBe(null);
});

test('non existing', async () => {
  mock({});

  const cnt = `
@import url('https://fonts.googleapis.com/css?family=Nonexisting:200,300,400,700&display=swap');
`;

  const res = await postcss([plugin({
    localPath: '/testfolder',
  })]).process(cnt, { from: undefined });

  expect(res.warnings()).toHaveLength(1);
});
