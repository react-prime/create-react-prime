const path = require('path');

const NODE_SCRIPT = `node ${path.resolve('src/index.js')}`;
const TEST_DIRECTORY = 'crp-test';

module.exports = {
  NODE_SCRIPT,
  TEST_DIRECTORY
};
