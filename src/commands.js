/* eslint-disable no-console */
const path = require('path');
const { spawn } = require('child_process');
const updatePackage = require('./updatePackage');
const {
  name, owner, cloneOptions, projectName, boilerplateNameAffix,
} = require('./installConfig');
const { TYPE } = require('./constants');
const program = require('./program');

/*
  All commands needed to run to guarantee a successful and clean installation
*/
const commands = [
  {
    cmd: `git clone ${cloneOptions} https://github.com/${owner}/${name}.git ${projectName}`,
    message: `🚚  Cloning ${name}${boilerplateNameAffix} into '${projectName}'...`,
    time: 3000,
  },
  {
    cmd: `npm --prefix ${projectName} install`,
    message: '📦  Installing packages...',
    time: 40000,
  },
  {
    cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
    fn: () => updatePackage(projectName),
    message: '🔨  Preparing...',
    time: 50,
  },
];

/*
  All commands that need a spawn execute
*/
const spawnCommands = {
  [TYPE.NATIVE]: [
    {
      message: `🔤  Renaming project files to '${projectName}'...`,
      time: 10000,
      fn: (cb) => {
        if (program.type === TYPE.NATIVE) {
          // Execute in project folder with cwd
          const sRename = spawn('npm', ['run', 'renameNative'], {
            cwd: path.resolve(projectName),
          });

          sRename.on('exit', () => {
            const sReplace = spawn('npm', ['run', 'replaceWithinFiles'], {
              cwd: path.resolve(projectName),
            });

            sReplace.on('exit', () => {
              const sSchemes = spawn('npm', ['run', 'replaceSchemeFilenames'], {
                cwd: path.resolve(projectName),
              });

              sSchemes.on('close', cb);
            });
          });
        }
      },
    },
  ],
};

module.exports = {
  commands,
  spawnCommands,
};

/* eslint-enable no-console */
