const fs = require('fs');
const path = require('path');
const { TYPE } = require('./constants');
const program = require('./program');

const updatePackage = (projectName) => {
  const projectPkgPath = path.resolve(`${projectName}/package.json`);
  const pkgRead = fs.readFileSync(projectPkgPath, 'utf8');
  const pkg = JSON.parse(pkgRead);

  // Overwrite boilerplate defaults
  pkg.name = projectName;
  pkg.version = '0.0.1';
  pkg.description = `Code for ${projectName}.`;
  pkg.author = 'Label A [labela.nl]';
  pkg.keywords = [];

  if (typeof pkg.repository === 'object') {
    pkg.repository.url = '';
  }

  if (program.type === TYPE.NATIVE) {
    pkg.scripts.rename = `npx react-native-rename ${projectName}`;
  }

  fs.writeFileSync(projectPkgPath, JSON.stringify(pkg, null, 2));
};

module.exports = updatePackage;