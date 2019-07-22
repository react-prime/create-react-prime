#!/usr/bin/env node

require('./polyfill');
const { name, boilerplateNameAffix } = require('./installConfig');
const install = require('./install');

/*
  Start install process
*/
install()
  .then(() => console.log(`⚡️ Succesfully installed ${name}${boilerplateNameAffix}!`)) // eslint-disable-line
  .catch((err) => console.error(err))
  .finally(() => process.exit());
