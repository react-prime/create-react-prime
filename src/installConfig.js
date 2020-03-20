const fs = require('fs');
const { ARG, TYPE } = require('./constants');
const program = require('./program');
const boilerplates = require('./boilerplates');

// Repository selector
const boilerplate = boilerplates[program.type];

// Project folder name. Defaults to repository name.
let projectName = program.args[ARG.PROJECT_NAME] || boilerplate.name;

// React-native does not allow non-alphanumeric characters in project name
if (program.type === TYPE.NATIVE) {
  projectName = projectName.replace(/\W/g, '');
}

// Check if directory already exists to prevent overwriting existing data
if (fs.existsSync(projectName)) {
  console.error(`Error: directory '${projectName}' already exists.`);
  process.exit();
}

module.exports = {
  name: boilerplate.name,
  owner: boilerplates.owner,
  projectName,
};
