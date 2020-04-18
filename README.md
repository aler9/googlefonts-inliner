
# googlefonts-inliner

[![Build Status](https://travis-ci.org/aler9/googlefonts-inliner.svg?branch=master)](https://travis-ci.org/aler9/googlefonts-inliner)
[![npm](https://img.shields.io/npm/v/googlefonts-inliner)](https://www.npmjs.com/package/googlefonts-inliner)

googlefonts-inliner is a command-line tool that allows to download all Google Fonts referenced by a stylesheet in CSS or SASS format, and serve them locally. This process is particularly useful when building UIs for offline or high-availability systems, like vehicle interfaces, HMIs, that cannot wait for external servers.

## Installation

```
npm i googlefonts-inliner
```

or

```
yarn add googlefonts-inliner
```

## Usage

```
node_modules/.bin/googlefonts-inliner <stylesheet path>
```

## Example

Let's suppose we have a stylesheet `style.css` with the following content:

```css
@import url('https://fonts.googleapis.com/css?family=Muli:200,300,400,700&display=swap');

body {
    background: red;
}
```

Run the tool:
```
googlefonts-inliner style.css
```

The stylesheet becomes:

```css
@import url(googlefonts/font0.css);

body {
    background: red;
}
```

While the following files are are created:

```
googlefonts/font0.css
googlefonts/UGY3eqadagewfiYGEwefiwehu.woff2
googlefonts/3rqeDQUIYhwegwefewfwefwef.woff2
```
