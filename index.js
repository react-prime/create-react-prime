#!/usr/bin/env node
require('./polyfill');

const program = require('commander');
const { exec } = require('child_process');
const fs = require('fs');
const createLogger = require('progress-estimator');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .parse(process.argv);

// Configure path to store progress estimations for future reference
const logger = createLogger();

const repoName = 'react-prime';
const projectName = program.args[0] || repoName;

// Check if directory already exists to prevent overwriting existind data
if (fs.existsSync(projectName)) {
  return console.error(`Error: directory '${projectName}' already exists.`);
}

// All commands to run to guarantee a successful and clean installation
const commands = [
  {
    cmd: `git clone https://github.com/JBostelaar/${repoName}.git ${projectName}`,
    message: `🚚 Cloning ${repoName} in ${projectName}...`,
    time: 3000,
  },
  {
    cmd: `npm --prefix ${projectName} install`,
    message: '📦 Installing packages...',
    time: 40000,
  },
  {
    cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
    message: '🔨 Preparing...',
    time: 50,
  },
];

// Installation cycles
const install = () => new Promise((resolve, reject) => {
  let step = 0;

  const run = async () => {
    await logger(
      new Promise((loggerResolve) => exec(commands[step].cmd, (err) => {
        if (err) {
          reject(err);
          return;
        }
    
        loggerResolve();
      })),
      commands[step].message || '',
      commands[step].time || 0,
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
  .then(() => console.log(`⚡️ Succesfully installed ${repoName}!`))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
