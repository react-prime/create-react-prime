import Util from 'core/util';
import Step from 'core/decorators/Step';
import cliMgr from 'core/CLIMgr';


@Step({
  name: 'cleanup',
  spinner: {
    emoji: '🧹',
    message: {
      pending: () => 'Cleaning up...',
      success: () => 'Cleaned up!',
    },
  },
})
export class CleanupStep {
  async on(): Promise<void> {
    const util = new Util();
    const projectName = cliMgr.getProjectName();

    await util.asyncExec(`rm -rf ${projectName}/.git ${projectName}/.travis.yml`);
  }
}
