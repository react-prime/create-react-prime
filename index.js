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

progressConfigure({
  storagePath: path.join(__dirname, '.progress-estimations'),
});

const repoName = 'react-prime';
const projectName = program.args[0] || repoName;

if (fs.existsSync(projectName)) {
  return console.error(`Error: directory '${projectName}' already exists.`);
}

const commands = [
  `git clone https://github.com/JBostelaar/${repoName}.git ${projectName}`,
  `cd ${projectName}`,
  'rm -rf .git',
  'rm .travis.yml',
  'npm i',
].join(' && ');

cmd.run(commands);

// Show visuals while cloning and installing packages
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

const run = async () => {
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

run().then(() => {
  console.log(`⚡️ Succesfully installed ${repoName}!`);
  process.exit();
});
