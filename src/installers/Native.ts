import InstallConfig from '../InstallConfig';
import Installer from './Installer';

export default class NativeInstaller extends Installer {
  constructor() {
    // Native project names can only contain alphanumerical characters
    InstallConfig.projectName = InstallConfig.projectName.replace(/\W/g, '');

    super();

    // Run additional scripts after NPM install
    this.addInstallStep({
      message: `🔤  Renaming project files to '${InstallConfig.projectName}'...`,
      time: 10000,
      fn: this.runScripts.bind(this),
    }, 2);
  }

  // Add additional scripts to node package
  protected async updatePackage() {
    const { projectName } = InstallConfig;
    const pkg = this.getProjectNpmPackage().json;

    pkg.scripts = pkg.scripts || {};
    pkg.scripts.renameNative = `npx react-native-rename ${projectName}`;
    pkg.scripts.replaceWithinFiles = `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`;
    pkg.scripts.replaceSchemeFilenames = `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`;

    super.updatePackage(pkg);
  }

  protected async cleanup(): Promise<void> {
    // "super" will not point to base class inside Promise function
    const cleanup = super.cleanup;
    const pkg = this.getProjectNpmPackage().json;

    delete pkg.scripts.renameNative;
    delete pkg.scripts.replaceWithinFiles;
    delete pkg.scripts.replaceSchemeFilenames;

    await this.writeToPackage(pkg);

    await cleanup();
  }


  // Run the additional scripts
  private async runScripts(): Promise<void> {
    await this.asyncSpawn('npm', ['run', 'renameNative']);
    await this.asyncSpawn('npm', ['run', 'replaceWithinFiles']);
    await this.asyncSpawn('npm', ['run', 'replaceSchemeFilenames']);
  }
}
