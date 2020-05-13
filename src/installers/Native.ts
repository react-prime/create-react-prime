import InstallConfig from '../InstallConfig';
import Installer from './Installer';

export default class NativeInstaller extends Installer {
  private scriptKeys: {
    rename: string;
    replaceText: string;
    replaceSchemes: string;
  };

  constructor() {
    // Native project names can only contain alphanumerical characters
    InstallConfig.projectName = InstallConfig.projectName.replace(/\W/g, '');

    super();

    this.scriptKeys = {
      rename: 'renameNative',
      replaceText: 'replaceWithinFiles',
      replaceSchemes: 'replaceSchemeFilenames',
    };

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
    pkg.scripts[this.scriptKeys.rename] = `npx react-native-rename ${projectName}`;
    pkg.scripts[this.scriptKeys.replaceText] =
      `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`;
    pkg.scripts[this.scriptKeys.replaceSchemes] =
      `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`;

    super.updatePackage(pkg);
  }

  protected async cleanup(): Promise<void> {
    const pkg = this.getProjectNpmPackage().json;

    delete pkg.scripts[this.scriptKeys.rename];
    delete pkg.scripts[this.scriptKeys.replaceText];
    delete pkg.scripts[this.scriptKeys.replaceSchemes];

    await this.writeToPackage(pkg);
    await super.cleanup();
  }


  // Run the additional scripts
  private async runScripts(): Promise<void> {
    await this.asyncSpawn('npm', ['run', this.scriptKeys.rename]);
    await this.asyncSpawn('npm', ['run', this.scriptKeys.replaceText]);
    await this.asyncSpawn('npm', ['run', this.scriptKeys.replaceSchemes]);
  }
}
