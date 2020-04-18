#!/usr/bin/env node

const yargs = require('yargs');

const run = require('.');


const { argv } = yargs
  .command('$0 <file>', 'embed google fonts into a given CSS or SASS stylesheet', (yargs2) => {
    yargs2
      .positional('file', {
        describe: 'stylesheet path',
        type: 'string',
      });
  })
  .help();

run({
  file: argv.file,
}).catch((e) => { console.error(e); process.exit(1); });
