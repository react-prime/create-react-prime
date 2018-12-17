#!/usr/bin/env node
require('./polyfill');

const program = require('commander');
const { exec } = require('child_process');
const fs = require('fs');
const createLogger = require('progress-estimator');
const pkg = require('./package.json');

// Create estimations logger
const logger = createLogger();

// Setup our program
program
  .version(pkg.version)
  .parse(process.argv);

// Naming constants
const REPO_NAME = 'react-prime';
const PROJECT_NAME = program.args[0] || REPO_NAME;

// Check if directory already exists to prevent overwriting existing data
if (fs.existsSync(PROJECT_NAME)) {
  return console.error(`Error: directory '${PROJECT_NAME}' already exists.`);
}

const updatePackage = () => {
  const projectPkgPath = `${PROJECT_NAME}/package.json`;
  const pkgRead = fs.readFileSync(projectPkgPath, 'utf8');
  const pkgParsed = JSON.parse(pkgRead);

  // Overwrite boilerplate defaults
  pkgParsed.name = PROJECT_NAME;
  pkgParsed.version = '0.0.1';
  pkgParsed.description = `Code for ${PROJECT_NAME}.`;
  pkgParsed.author = 'Label A [labela.nl]';
  pkgParsed.repository.url = '';
  pkgParsed.keywords = [];

  fs.writeFileSync(projectPkgPath, JSON.stringify(pkgParsed, null, 2));
};

// All commands needed to run to guarantee a successful and clean installation
const commands = [
  {
    cmd: `git clone https://github.com/JBostelaar/${REPO_NAME}.git ${PROJECT_NAME}`,
    message: `🚚 Cloning ${REPO_NAME} into '${PROJECT_NAME}'...`,
    time: 3000,
  },
  {
    cmd: `npm --prefix ${PROJECT_NAME} install`,
    message: '📦 Installing packages...',
    time: 40000,
  },
  {
    cmd: `rm -rf ${PROJECT_NAME}/.git ${PROJECT_NAME}/.travis.yml`,
    fn: updatePackage,
    message: '🔨 Preparing...',
    time: 50,
  },
];

// Installation cycles
const install = () => new Promise((resolve, reject) => {
  let step = 0;

  const run = async () => {
    const installStep = commands[step];

    await logger(
      new Promise((loggerResolve) => exec(installStep.cmd, (err) => {
        if (err) return reject(err);

        if (installStep.fn) installStep.fn();
    
        loggerResolve();
      })),
      installStep.message || '',
      {
        id: step.toString(),
        estimate: installStep.time || 0,
      },
    );

    if (step < commands.length - 1) {
      step++;
      run();
    } else {
      resolve();
    }
  }

  run();
});

// Start process
install()
  .then(() => console.log(`⚡️ Succesfully installed ${REPO_NAME}!`))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
