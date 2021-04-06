import Step from 'core/decorators/Step';
import Util from 'core/util';
import cliMgr from 'core/CLIMgr';


@Step({
  name: 'npm_install',
  spinner: {
    emoji: '📦',
    message: {
      pending: () => 'Installing packages...',
      success: () => 'Installed packages!',
    },
  },
})
export class NpmInstallStep {
  async on(): Promise<void> {
    const util = new Util();
    await util.asyncExec(`npm --prefix ${cliMgr.getProjectName()} install`);
  }
}
