
# googlefonts-inliner

googlefonts-inliner is a command-line tool that allows to download all Google Fonts referenced in a stylesheet in CSS or SASS format, and serve them locally. This process is particularly useful when building UIs for offline or high-availability systems, like vehicle interfaces, HMIs, that cannot wait for the Google servers to respond. Let's suppose we have a stylesheet like:

```
@import url('https://fonts.googleapis.com/css?family=Muli:200,300,400,700&display=swap');

body {
    background: red;
}
```

After running the tool, the stylesheet becomes:

```
@import url(googlefonts/font0.css);

body {
    background: red;
}
```

and in the `googlefonts/` folder the following files are are created:

```
font0.css
UGY3eqadagewfiYGEwefiwehu.woff2
3rqeDQUIYhwegwefewfwefwef.woff2
```

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
node_modules/.bin/googlefonts-inliner <filename>
```
