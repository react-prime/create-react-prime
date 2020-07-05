import { INSTALL_STEP } from '../constants';
import Installer from './Installer';

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

  protected initSteps(): void {
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
      /** @TODO broken: does not remove scripts */
      .modifyStep('CLEANUP', {
        fn: this.cleanup.bind(this),
      });
  }


  /** Add additional scripts to package.json */
  protected async updatePackage(): Promise<void> {
    const { projectName } = this.cliMgr;
    const pkg = this.packageMgr.package.json;

    pkg.scripts = pkg.scripts || {};
    pkg.scripts[this.SCRIPT_KEY.rename] = `npx react-native-rename ${projectName}`;
    pkg.scripts[this.SCRIPT_KEY.replaceText] =
      `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`;
    pkg.scripts[this.SCRIPT_KEY.replaceSchemes] =
      `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`;

    await this.packageMgr.update(pkg);
  }

  /** Remove scripts from package.json */
  protected async cleanup(): Promise<void> {
    const pkg = this.packageMgr.package.json;

    if (pkg.scripts) {
      delete pkg.scripts[this.SCRIPT_KEY.replaceText];
      delete pkg.scripts[this.SCRIPT_KEY.replaceSchemes];
      delete pkg.scripts[this.SCRIPT_KEY.rename];

      await this.packageMgr.write(pkg);
    }
  }


  /** Run the rename scripts */
  private async runScripts(): Promise<void> {
    const pkg = this.packageMgr.package.json;

    const { SCRIPT_KEY } = this;
    const scriptKeys = Object.values(SCRIPT_KEY);

    for await (const script of scriptKeys) {
      if (!pkg.scripts?.[script]) {
        this.logger.warning(`Script '${script}' was not found. Manual file renaming is required after installation.'`);
      }

      await this.asyncSpawn('npm', ['run', script])
        .catch((err) => {
          this.logger.warning(
            `Script '${script}' has failed. Manual file renaming is required after installation.`,
            err,
          );
        });
    }
  }
}
