/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const updatePackage = require('./updatePackage');
const { name, owner, projectName } = require('./installConfig');
const { TYPE } = require('./constants');
const program = require('./program');

/**
 * Promisify spawns
 * util.promisify doesn't work :(
 */
async function asyncSpawn(command, args, options = {}) {
  const opts = {
    // Execute in given folder path with cwd
    cwd: options.cwd || path.resolve(projectName),
  };

  return new Promise((resolve, reject) => {
    spawn(command, args, opts)
      .on('close', resolve)
      .on('error', reject);
  });
}

/*
  All commands needed to run to guarantee a successful and clean installation
*/
const commands = [
  {
    cmd: `git clone https://github.com/${owner}/${name}.git ${projectName}`,
    message: `🚚  Cloning ${name} into '${projectName}'...`,
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
      fn: async (cb) => {
        if (program.type === TYPE.NATIVE) {
          // Run project files rename scripts
          await asyncSpawn('npm', ['run', 'renameNative']);
          await asyncSpawn('npm', ['run', 'replaceWithinFiles']);
          await asyncSpawn('npm', ['run', 'replaceSchemeFilenames']);

          // Resolve project's package.json
          const projectPkgPath = path.resolve(`${projectName}/package.json`);
          const pkgRead = fs.readFileSync(projectPkgPath, 'utf8');
          const pkg = JSON.parse(pkgRead);

          // Remove renaming scripts
          delete pkg.scripts.renameNative;
          delete pkg.scripts.replaceWithinFiles;
          delete pkg.scripts.replaceSchemeFilenames;

          // Write updated package.json back to its file
          fs.writeFileSync(projectPkgPath, JSON.stringify(pkg, null, 2));

          // Execute callback fn
          cb();
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
