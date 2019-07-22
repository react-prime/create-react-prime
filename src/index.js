#!/usr/bin/env node

require('./polyfill');
const { name } = require('./installConfig');
const install = require('./install');

/*
  Start install process
*/
install()
  .then(() => console.log(`⚡️ Succesfully installed ${name}!`))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
