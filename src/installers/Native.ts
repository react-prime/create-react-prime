import util from 'util';
import path from 'path';
import cp from 'child_process';
import { INSTALL_STEP } from '../constants';
import Installer from './Installer';


// Wrap utils in promise
const exec = util.promisify(cp.exec);


export default class NativeInstaller extends Installer {
  init(): void {
    // Native project names can only contain alphanumerical characters
    this.cliMgr.projectName = this.cliMgr.projectName.replace(/\W/g, '');

    super.init();
  }

  protected initSteps(): void {
    super.initSteps();

    const { projectName } = this.cliMgr;

    // Execute file rename scripts before NPM install
    const renameStep = {
      id: INSTALL_STEP.RUN_NATIVE_SCRIPTS,
      emoji: '🔤',
      message: {
        pending: `Renaming project files to '${projectName}'...`,
        success: `Renamed project files to '${projectName}'!`,
      },
      fn: this.runScripts.bind(this),
    };

    this.installStepList.addAfterStep('UPDATE_PACKAGE', renameStep);
  }

  /** Run the rename scripts */
  private async runScripts(): Promise<void> {
    const { projectName, isDebugging } = this.cliMgr;

    const scripts = [
      ['rename', `npx react-native-rename ${projectName}`],
      ['replace text', `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`],
      ['replace schemes', `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`],
    ];

    const options: cp.ExecOptions = {
      cwd: path.resolve(this.cliMgr.projectName),
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
