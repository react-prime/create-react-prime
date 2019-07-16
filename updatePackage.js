const fs = require('fs');

const updatePackage = (projectName) => {
  const projectPkgPath = `${projectName}/package.json`;
  const pkgRead = fs.readFileSync(projectPkgPath, 'utf8');
  const pkgParsed = JSON.parse(pkgRead);

  // Overwrite boilerplate defaults
  pkgParsed.name = projectName;
  pkgParsed.version = '0.0.1';
  pkgParsed.description = `Code for ${projectName}.`;
  pkgParsed.author = 'Label A [labela.nl]';
  pkgParsed.repository.url = '';
  pkgParsed.keywords = [];

  fs.writeFileSync(projectPkgPath, JSON.stringify(pkgParsed, null, 2));
};

module.exports = updatePackage;
