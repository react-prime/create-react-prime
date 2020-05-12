import App from '../App';
import Installer from './Installer';

export default class NativeInstaller extends Installer {
  constructor() {
    super();

    const { projectName } = App.getInstallConfig();

    // Native project names can only contain alphanumerical characters
    App.setProjectName(
      projectName.replace(/\W/g, ''),
    );

    // Run additional scripts after NPM install
    this.addInstallStep({
      message: `🔤  Renaming project files to '${projectName}'...`,
      time: 10000,
      fn: this.runScripts.bind(this),
    }, 2);
  }

  // Add additional scripts to node package
  protected async updatePackage() {
    const { projectName } = App.getInstallConfig();
    const pkg = App.getProjectNpmPackage().json;

    pkg.scripts = pkg.scripts || {};
    pkg.scripts.renameNative = `npx react-native-rename ${projectName}`;
    pkg.scripts.replaceWithinFiles = `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`;
    pkg.scripts.replaceSchemeFilenames = `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`;

    super.updatePackage(pkg);
  }

  protected cleanup(): Promise<void> {
    // "super" will not point to base class inside Promise function
    const cleanup = super.cleanup;

    return new Promise(async (resolve, reject) => {
      const pkg = App.getProjectNpmPackage().json;

      try {
        delete pkg.scripts.renameNative;
        delete pkg.scripts.replaceWithinFiles;
        delete pkg.scripts.replaceSchemeFilenames;

        this.writeToPackage(pkg);

        await cleanup();

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }


  // Run the additional scripts
  private runScripts(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.asyncSpawn('npm', ['run', 'renameNative']);
        await this.asyncSpawn('npm', ['run', 'replaceWithinFiles']);
        await this.asyncSpawn('npm', ['run', 'replaceSchemeFilenames']);

        resolve();
      } catch (err) {
        reject();
      }
    });
  }
}
