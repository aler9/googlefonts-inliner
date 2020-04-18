
const mock = require('mock-fs');
const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);

const run = require('.');


afterEach(async () => {
  mock.restore();
});

test('sass', async () => {
  mock({
    '/testfolder/style.scss': '\n'
    + '@import url(\'https://fonts.googleapis.com/css?family=Muli:200,300,400,700&display=swap\');\n'
    + '@import url(\'https://fonts.googleapis.com/css?family=Cutive+Mono&display=swap\');\n'
    + '@import "external.scss";\n'
    + 'body {\n'
    + '    background: blue;\n'
    + '}\n',
  });

  await run({
    file: '/testfolder/style.scss',
  });

  expect(await readFile('/testfolder/style.scss', 'utf-8')).toBe('\n'
    + '@import "googlefonts/font0.scss";\n'
    + '@import "googlefonts/font1.scss";\n'
    + '@import "external.scss";\n'
    + 'body {\n'
    + '    background: blue;\n'
    + '}\n');

  expect(await readFile('/testfolder/googlefonts/font0.scss', 'utf-8')).not.toBeNull();
  expect(await readFile('/testfolder/googlefonts/font1.scss', 'utf-8')).not.toBeNull();
});

test('css', async () => {
  mock({
    '/testfolder/style.css': '\n'
    + '@import url(\'https://fonts.googleapis.com/css?family=Muli:200,300,400,700&display=swap\');\n'
    + '@import url(\'https://fonts.googleapis.com/css?family=Cutive+Mono&display=swap\');\n'
    + 'body {\n'
    + '    background: blue;\n'
    + '}\n',
  });

  await run({
    file: '/testfolder/style.css',
  });

  expect(await readFile('/testfolder/style.css', 'utf-8')).toBe('\n'
    + '@import url(googlefonts/font0.css);\n'
    + '@import url(googlefonts/font1.css);\n'
    + 'body {\n'
    + '    background: blue;\n'
    + '}\n');

  expect(await readFile('/testfolder/googlefonts/font0.css', 'utf-8')).not.toBeNull();
  expect(await readFile('/testfolder/googlefonts/font1.css', 'utf-8')).not.toBeNull();
});
