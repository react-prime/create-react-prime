const updatePackage = require('./updatePackage');
const { name, author, cloneOptions, projectName } = require('./installConfig');

/*
  All commands needed to run to guarantee a successful and clean installation
*/
const generateCommands = () => [
  {
    cmd: `git clone ${cloneOptions} https://github.com/${author}/${name}.git ${projectName}`,
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

module.exports = generateCommands;
