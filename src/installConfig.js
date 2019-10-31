const fs = require('fs');
const { ARG, TYPE } = require('./constants');
const program = require('./program');
const boilerplates = require('./boilerplates');

// Repository selector
const boilerplate = boilerplates[program.type];

// Project folder name. Defaults to repository name.
const projectName = program.args[ARG.PROJECT_NAME] || boilerplate.name;

// Check if directory already exists to prevent overwriting existing data
if (fs.existsSync(projectName)) {
  console.error(`Error: directory '${projectName}' already exists.`);
  process.exit();
}


// Options to add when cloning
let cloneOptions = '';
let boilerplateNameAffix = '';

if (program.typescript) {
  cloneOptions = '--single-branch --branch typescript';
  boilerplateNameAffix = ' (Typescript)';
}

module.exports = {
  name: boilerplate.name,
  owner: boilerplates.owner,
  cloneOptions,
  projectName,
  boilerplateNameAffix,
};
