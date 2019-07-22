/* eslint-disable no-console */
const path = require('path');
const { exec } = require('child_process');
const tests = require('./tests');
const { TEST_DIRECTORY } = require('./constants');

const removeDirectory = (i, cb) => {
  exec(`rm -rf ${path.resolve(TEST_DIRECTORY)}-${i}`, cb);
};

const runTest = (i) => {
  const test = tests[i];

  console.log(`🛠  Running test '${test.name}'`);

  // Run test script
  exec(test.script, (err) => {
    if (err) {
      console.error(`❌  Test '${test.name}' failed`);
      finishTest(false);

      return;
    }

    // Finish up test
    removeDirectory(i, (err) => {
      if (err) return console.error(`❌  Removing directory for test '${test.name}' failed`);

      console.log(`✅  Test '${test.name}' done!`);
      finishTest(true);
    });
  });
};

let testsChecked = 0;
let testsSucceeded = 0;
const finishTest = (success) => {
  testsChecked++;

  if (success) {
    testsSucceeded++;
  }

  if (testsChecked >= tests.length) {
    console.log('------');

    // Check if all tests are done.
    if (testsSucceeded >= tests.length) {
      console.log('✅  All tests passed!');
      process.exit();
    } else {
      console.error('❌  Test failed.');
      process.exit(1);
    }
  }
};

const runTests = () => {
  // Remove all directories in case there is any left over
  tests.forEach((_, i) => {
    removeDirectory(i);
  });

  // Run all test simultaneously
  tests.forEach((_, i) => {
    runTest(i);
  });
};

module.exports = runTests;
