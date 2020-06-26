#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { TEXT } = require('./constants');
const { name } = require('./installConfig');
const install = require('./install');

const pkgRead = fs.readFileSync(path.resolve('package.json'), 'utf8');
const pkg = JSON.parse(pkgRead);

/*
  Start install process
*/

console.log(`create-react-prime v${pkg.version}`);

install()
  .then(() => {
    console.log(`⚡️ ${TEXT.BOLD} Succesfully installed ${name}! ${TEXT.DEFAULT}`);

    process.exit();
  });

/* eslint-enable no-console */
