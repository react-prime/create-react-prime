import path from 'path';
import { spawn } from 'child_process';
import updatePackage from './updatePackage';
import {
  name, owner, cloneOptions, projectName, boilerplateNameAffix,
} from './installConfig';
import { TYPE } from './constants';
import program from './program';

/*
  All commands needed to run to guarantee a successful and clean installation
*/
export const commands = [
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
export const spawnCommands = {
  [TYPE.NATIVE]: [
    {
      message: `🔤  Renaming project files to '${projectName}'...`,
      time: 10000,
      fn: (cb: () => void) => {
        if (program.type === TYPE.NATIVE) {
          const s = spawn('npm', ['run', 'rename'], {
            // Execute in project folder
            cwd: path.resolve(projectName),
          });

          s.on('close', cb);
        }
      },
    },
  ],
};
