const { NODE_SCRIPT, TEST_DIRECTORY } = require('./constants');

const tests = [
  // Boilerplates
  {
    name: 'client',
    script: `${NODE_SCRIPT} ${TEST_DIRECTORY}-0`,
  },
  {
    name: 'ssr',
    script: `${NODE_SCRIPT} -t ssr ${TEST_DIRECTORY}-1`,
  },
  {
    name: 'native',
    script: `${NODE_SCRIPT} -t native ${TEST_DIRECTORY}-2`,
  },

  // Typescript
  {
    name: 'client + typescript',
    script: `${NODE_SCRIPT} --typescript ${TEST_DIRECTORY}-3`,
  },
];

module.exports = tests;
