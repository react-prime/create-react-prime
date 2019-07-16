#!/usr/bin/env node
require('./polyfill');

const program = require('commander');
const { exec } = require('child_process');
const fs = require('fs');
const createLogger = require('progress-estimator');
const updatePackage = require('./updatePackage');
const pkg = require('./package.json');

// Create estimations logger
const logger = createLogger();

// Argument names
const ARGS = {
  PROJECT_NAME: 0,
};

// Program options
program
  .option(
    '-t, --type <type>',
    'Install a type of react-prime. Options: client, ssr. Default: client',
    'client',
  );

// Setup our program
program
  .version(pkg.version)
  .parse(process.argv);

// Repo selector. Defaults to react-prime.
let REPO_NAME = 'react-prime';

if (program.type) {
  const typeAffix = program.type === 'client' ? '' : `-${program.type}`;
  REPO_NAME = `${REPO_NAME}${typeAffix}`;
}

// Project folder name. Defaults to repo name.
const PROJECT_NAME = program.args[ARGS.PROJECT_NAME] || REPO_NAME;

// Check if directory already exists to prevent overwriting existing data
if (fs.existsSync(PROJECT_NAME)) {
  return console.error(`Error: directory '${PROJECT_NAME}' already exists.`);
}

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
    fn: () => updatePackage(PROJECT_NAME),
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

        if (typeof installStep.fn === 'function') {
          installStep.fn();
        }
    
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
