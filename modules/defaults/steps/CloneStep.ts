import * as i from 'types';

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
  async on(options: i.StepOptions): Promise<void> {
    return new Promise((res) => setTimeout(() => {
      res();
    }, 2000));
  }
}
