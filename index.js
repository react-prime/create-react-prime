#!/usr/bin/env node

const program = require('commander');
const cmd = require('node-cmd');
const fs = require('fs');
const path = require('path');
const { logProgress, configure: progressConfigure } = require('progress-estimator');
const pkg = require('./package.json');
const noop = () => {};

program
  .version(pkg.version)
  .parse(process.argv);

// Configure path to store progress estimations for future reference
progressConfigure({
  storagePath: path.join(__dirname, '.progress-estimations'),
});

const repoName = 'react-prime';
const projectName = program.args[0] || repoName;

// Check if directory already exists to prevent overwriting existind data
if (fs.existsSync(projectName)) {
  return console.error(`Error: directory '${projectName}' already exists.`);
}

// All commands to run to guarantee a successful and clean installation
const commands = [
  `git clone https://github.com/JBostelaar/${repoName}.git ${projectName}`,
  `cd ${projectName}`,
  'rm -rf .git',
  'rm .travis.yml',
  'npm i',
].join(' && ');

/*
  Show visuals while cloning and installing packages
*/

// Function that resolves when a conditional function returns true
const wait = async (existsFn, callback = noop) => new Promise((resolve) => {
  const check = () => {
    if (existsFn()) {
      callback();
      resolve();
    } else {
      setTimeout(check, 1);
    }
  }

  check();
});

// While commands are running we show the progress of the installation
const install = async () => {
  // Run all commands
  cmd.run(commands);

  // Wait for project folder to exist
  await logProgress(
    wait(() => fs.existsSync(`./${projectName}`)),
    `🚚 Cloning ${repoName} in ${projectName}...`,
    200,
  );

  // Wait for node_modules folder to exist to check if we are in the "npm i" phase
  await logProgress(
    wait(
      () => fs.existsSync(`./${projectName}/node_modules`),
      () => {
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
      }
    ),
    '📦 Installing packages...',
    15000,
  )
}

// Start visuals
install().then(() => {
  console.log(`⚡️ Succesfully installed ${repoName}!`);
  process.exit();
});
