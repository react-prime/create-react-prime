import * as i from 'types';

import Util from 'core/util';
import Step from 'core/decorators/Step';
import cliMgr from 'core/CLIMgr';


@Step({
  name: 'clone',
  spinner: {
    emoji: '🚚',
    message: {
      pending: () => `Cloning '${cliMgr.getBoilerplate()}' into '${cliMgr.getProjectName()}'...`,
      success: () => `Cloned '${cliMgr.getBoilerplate()}' into '${cliMgr.getProjectName()}'!`,
    },
  },
})
export class CloneStep {
  async on(options: i.InstallStepArgs): Promise<void> {
    const util = new Util();
    await util.asyncExec(`git clone ${options.cloneUrl} ${cliMgr.getProjectName()}`);
  }
}
