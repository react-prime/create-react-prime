const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { installation, removeAllDirectories, tests, TEST_DIRECTORY } = require('./installation');

describe('Installation', function() {
  this.timeout(3e5); // 5 mins

  it('installs all boilerplate types without error', async function() {
    const result = await installation();

    assert.ok(result);
  });

  it('set values in package.json to the correct values', function() {
    tests.forEach((_, i) => {
      const projectName = `${TEST_DIRECTORY}${i}`;

      // Parse package.json to JSON
      const projectPkgPath = path.resolve(`${projectName}/package.json`);
      const pkgRead = fs.readFileSync(projectPkgPath, 'utf8');
      const pkgParsed = JSON.parse(pkgRead);

      // Check if all values are set correctly
      assert.equal(pkgParsed.name, projectName);
      assert.equal(pkgParsed.version, '0.0.1');
      assert.equal(pkgParsed.description, `Code for ${projectName}.`);
      assert.equal(pkgParsed.author, 'Label A [labela.nl]');

      // Check if keywords is set to an empty array
      assert.ok(Array.isArray(pkgParsed.keywords));
      assert.equal(pkgParsed.keywords.length, 0);

      if (typeof pkgParsed.repository === 'object') {
        assert.equal(pkgParsed.repository.url, '');
      }
    });
  });

  after(function() {
    removeAllDirectories();
  });
});
