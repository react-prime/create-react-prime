import util from 'util';
import path from 'path';
import cp from 'child_process';
import * as i from 'types';

import Installer from 'core/Installer';


// Wrap utils in promise
const exec = util.promisify(cp.exec);


export default class NativeInstaller extends Installer implements i.InstallerType {
  init(): void {
    // Native project names can only contain alphanumerical characters
    const orgProjectName = this.cliMgr.projectName;
    this.cliMgr.projectName = this.cliMgr.projectName!.replace(/\W/g, '');

    if (orgProjectName !== this.cliMgr.projectName) {
      // eslint-disable-next-line max-len
      this.logger.warning(`Project name has been renamed to '${this.cliMgr.projectName}'.\nRead more: https://github.com/facebook/react-native/issues/213.\n`);
    }

    super.init();
  }


  protected initSteps(): void {
    super.initSteps();

    const { projectName } = this.cliMgr;

    // Execute file rename scripts before NPM install
    const renameStep: i.InstallStepOptions = {
      id: 'runNativeScripts',
      emoji: '🔤',
      message: {
        pending: `Renaming project files to '${projectName}'...`,
        success: `Renamed project files to '${projectName}'!`,
      },
      fn: this.runScripts.bind(this),
    };

    this.installStepList.addAfterStep('updatePackage', renameStep);
  }


  /** Run the rename scripts */
  private async runScripts(): Promise<void> {
    const { projectName, isDebugging } = this.cliMgr;

    const scripts = [
      ['rename files', `npx react-native-rename ${projectName}`],
      ['replace text', `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`],
      ['replace schemes', `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`],
    ];

    const options: cp.ExecOptions = {
      cwd: path.resolve(this.cliMgr.projectName!),
    };

    for await (const [name, script] of scripts) {
      await exec(script, options)
        .catch((err) => {
          this.logger.warning(
            `Script '${name}' has failed. Manual file renaming is required after installation.`,
            isDebugging ? err : '',
          );
        });
    }
  }
}
