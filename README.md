
# googlefonts-inliner

[![Test](https://github.com/aler9/googlefonts-inliner/actions/workflows/test.yml/badge.svg)](https://github.com/aler9/googlefonts-inliner/actions/workflows/test.yml)
[![npm](https://img.shields.io/badge/npm-googlefonts--inliner-blue.svg)](https://www.npmjs.com/package/googlefonts-inliner)

googlefonts-inliner is a PostCSS plugin that downloads all Google Fonts imported by a stylesheet in CSS or SASS format, and makes them available as local files. This process eliminates the need of fetching external resources during page loads, and is particularly useful when building UIs for offline or high-availability systems, like vehicle interfaces or HMIs.

Given a stylesheet with the following content:

```css
@import url('https://fonts.googleapis.com/css?family=Muli:200,300,400,700&display=swap');

body {
    background: red;
}
```

After running PostCSS, it becomes:

```css
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk40eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Muli';
  font-style: normal;
  font-weight: 200;
  font-display: swap;
  src: url(googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk50eifxHiDnzM.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
...

body {
    background: red;
}
```

While the following files are created:

```
googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk40eifxHiDnzM.woff2
googlefonts/7Aulp_0qiz-aVz7u3PJLcUMYOFlOkEk50eifxHiDnzM.woff2
```

Please note that while it is technically possible to embed font files directly into the stylesheet, this is avoided since inlined fonts [make a web page less efficient](https://www.zachleat.com/web/web-font-data-uris/).

## Installation

```
yarn add googlefonts-inliner postcss
```

## Usage with postcss-cli

There are multiple ways to run PostCSS, the most simple consists in using `postcss-cli`, that can installed with:

```
yarn add postcss-cli
```

Create a file named `postcss.config.js` with the following content:

```js
module.exports = {
  plugins: [
    require('googlefonts-inliner')(),
  ],
};
```

If the `postcss-import` plugin is also in use, put `googlefonts-inliner` after it, not before.

Run PostCSS against the target stylesheet:

```
npx postcss style.css -o style_edited.css
```

## Usage with webpack

Make sure that this entry is present into the `module.rules` array:

```js
{
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: { url: true, modules: true },
    },
    'postcss-loader',
  ],
},
```

Create a file named `postcss.config.js` with the following content:

```js
module.exports = {
  plugins: [
    require('googlefonts-inliner')({
      localPath: './',
      webPath: '~',
    }),
  ],
};
```

Run webpack:

```
npx webpack
```

## Options

```js
require('googlefonts-inliner')({
  // the folder in which fonts will be saved
  localPath: './googlefonts',
  // the path of localPath as served by the web server
  webPath: 'googlefonts',
  // the user agent used to download the fonts
  userAgent: 'Mozilla/5.0 (iPad; CPU OS 10_3_3 like Mac OS X)'
    + ' AppleWebKit/603.1.30 (KHTML, like Gecko) CriOS/63.0.3239.73 Mobile/14G60 Safari/602.1',
})
```

## Links

Similar software

* [embedded-google-fonts](https://github.com/amio/embedded-google-fonts)
