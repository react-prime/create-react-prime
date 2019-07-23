const assert = require('assert');
const install = require('./installation');

describe('Installation', function() {
  this.timeout(300e3); // 5 mins

  it('installs all boilerplate types without error', async function () {
    const result = await install();

    assert.ok(result);
  });
});
