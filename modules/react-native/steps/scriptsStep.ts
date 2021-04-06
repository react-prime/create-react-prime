import path from 'path';
import cp from 'child_process';

import Step from 'core/decorators/Step';
import cliMgr from 'core/CLIMgr';
import Util from 'core/util';
import Logger from 'core/Logger';


@Step({
  name: 'native-scripts',
  after: 'update-package',
  spinner: {
    emoji: '🔤',
    message: {
      pending: () => `Renaming project files to '${cliMgr.getProjectName()}'...`,
      success: () => `Renamed project files to '${cliMgr.getProjectName()}'!`,
    },
  },
})
export default class ScriptsStep {
  async on(): Promise<void> {
    const util = new Util();
    const logger = new Logger();
    const projectName = cliMgr.getProjectName();

    const scripts = [
      ['rename files', `npx react-native-rename ${projectName}`],
      ['replace text', `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`],
      ['replace schemes', `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`],
    ];

    const options: cp.ExecOptions = {
      cwd: path.resolve(projectName),
    };

    for await (const [name, script] of scripts) {
      await util.asyncExec(script, options)
        .catch(() => {
          logger.warning(`Script '${name}' has failed. Manual file renaming is required after installation.`);
        });
    }
  }
}
