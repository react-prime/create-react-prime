import INSTALL_STEP from '../InstallStep/steps';
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

    // Rename project files to given project name
    this.installSteps.addAfterStep('UPDATE_PACKAGE', {
      id: INSTALL_STEP.RUN_NATIVE_SCRIPTS,
      emoji: '🔤',
      message: `Renaming project files to '${InstallConfig.projectName}'...`,
      fn: this.runScripts.bind(this),
    });
  }


  // Add additional scripts to node package
  protected async updatePackage(): Promise<void> {
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

    if (pkg.scripts) {
      delete pkg.scripts[this.scriptKeys.replaceText];
      delete pkg.scripts[this.scriptKeys.replaceSchemes];
      delete pkg.scripts[this.scriptKeys.rename];

      await this.writeToPackage(pkg);
    }

    await super.cleanup();
  }


  // Run the additional scripts
  private async runScripts(): Promise<void> {
    await this.asyncSpawn('npm', ['run', this.scriptKeys.rename]);
    await this.asyncSpawn('npm', ['run', this.scriptKeys.replaceText]);
    await this.asyncSpawn('npm', ['run', this.scriptKeys.replaceSchemes]);
  }
}
