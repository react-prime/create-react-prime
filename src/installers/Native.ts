import { injectable } from 'inversify';
import { INSTALL_STEP } from '../constants';
import Installer from './Installer';

@injectable()
export default class NativeInstaller extends Installer {
  private readonly SCRIPT_KEY = {
    rename: 'renameNative',
    replaceText: 'replaceWithinFiles',
    replaceSchemes: 'replaceSchemeFilenames',
  };

  init(): void {
    // Native project names can only contain alphanumerical characters
    this.cliMgr.projectName = this.cliMgr.projectName.replace(/\W/g, '');

    super.init();
  }

  initSteps(): void {
    super.initSteps();

    // Add project files rename scripts to package.json
    this.installStepList
      .addAfterStep('UPDATE_PACKAGE', {
        id: INSTALL_STEP.RUN_NATIVE_SCRIPTS,
        emoji: '🔤',
        message: {
          pending: `Renaming project files to '${this.cliMgr.projectName}'...`,
          success: `Renamed project files to '${this.cliMgr.projectName}'!`,
        },
        fn: this.runScripts.bind(this),
      })
    // Remove the rename scripts from the package.json
      .modifyStep('CLEANUP', {
        fn: this.cleanup.bind(this),
      });
  }


  /** Add additional scripts to node package */
  protected async updatePackage(): Promise<void> {
    const { projectName } = this.cliMgr;
    const pkg = this.getProjectNpmPackage().json;

    pkg.scripts = pkg.scripts || {};
    pkg.scripts[this.SCRIPT_KEY.rename] = `npx react-native-rename ${projectName}`;
    pkg.scripts[this.SCRIPT_KEY.replaceText] =
      `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`;
    pkg.scripts[this.SCRIPT_KEY.replaceSchemes] =
      `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`;

    super.updatePackage(pkg);
  }

  /** Remove scripts from package.json */
  protected async cleanup(): Promise<void> {
    const pkg = this.getProjectNpmPackage().json;

    if (pkg.scripts) {
      delete pkg.scripts[this.SCRIPT_KEY.replaceText];
      delete pkg.scripts[this.SCRIPT_KEY.replaceSchemes];
      delete pkg.scripts[this.SCRIPT_KEY.rename];

      await this.writeToPackage(pkg);
    }
  }


  /** Run the rename scripts */
  private async runScripts(): Promise<void> {
    await this.asyncSpawn('npm', ['run', this.SCRIPT_KEY.rename]);
    await this.asyncSpawn('npm', ['run', this.SCRIPT_KEY.replaceText]);
    await this.asyncSpawn('npm', ['run', this.SCRIPT_KEY.replaceSchemes]);
  }
}
