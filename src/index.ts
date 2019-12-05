#!/usr/bin/env node
/* eslint-disable no-console */

// import './polyfill';
import { TEXT } from './constants';
import { name, boilerplateNameAffix } from './installConfig';
import install from './install';
import runSpawns from './runSpawns';

/*
  Start install process
*/
install()
  .then(runSpawns)
  .finally(() => {
    console.log(
      `⚡️ ${TEXT.BOLD} Succesfully installed ${name}${boilerplateNameAffix}! ${TEXT.DEFAULT}`
    );

    process.exit();
  });

/* eslint-enable no-console */
