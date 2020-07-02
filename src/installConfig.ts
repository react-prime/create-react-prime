import fs from 'fs';
import { ARG, TYPE } from './constants';
import program from './program';
import boilerplates from './boilerplates.json';

// Repository selector
const boilerplate = boilerplates[program.type as 'client' | 'ssr' | 'native'];

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

export const { name } = boilerplate;
export const { owner } = boilerplates;
export {
  cloneOptions,
  projectName,
  boilerplateNameAffix,
};
