import * as i from 'types';
import path from 'path';
import cp from 'child_process';

import STEPS from 'modules/steps/identifiers';

import JsDefaultInstaller from './Default';


export default class JsNativeInstaller extends JsDefaultInstaller {
  beforeInit() {
    // Native project names can only contain alphanumerical characters
    const orgProjectName = this.cliMgr.projectName;
    this.cliMgr.projectName = this.cliMgr.projectName!.replace(/\W/g, '');

    if (orgProjectName !== this.cliMgr.projectName) {
      this.logger.warning(`Project name has been renamed to '${this.cliMgr.projectName}'.\nRead more: https://github.com/facebook/react-native/issues/213.\n`); // eslint-disable-line max-len
    }
  }

  async afterInstallStep(step: i.InstallStepIds) {
    if (step === STEPS.RunNativeScripts) {
      await this.runScripts();
    }
  }

  /** Run the rename scripts */
  async runScripts(): Promise<void> {
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
      await this.exec(script, options)
        .catch((err) => {
          this.logger.warning(
            `Script '${name}' has failed. Manual file renaming is required after installation.`,
            isDebugging ? err : '',
          );
        });
    }
  }
}
