import { injectable, inject } from 'inversify';
import SERVICES from '../ioc/services';
import { InstallerType, CLIMgrType } from '../ioc';
import InstallStepList from '../InstallStepList';
import { INSTALL_STEP, ORGANIZATION } from '../constants';

@injectable()
export default class Installer implements InstallerType {
  @inject(SERVICES.CLIMgr) private readonly cliMgr!: CLIMgrType;
  protected installStepList = new InstallStepList();

  async start(): Promise<void> {
    this.initSteps();
    return;
  }


  /**
   * Add the basic installation steps. Can be overloaded to add or modify steps.
   */
  protected initSteps(): void {
    const { projectName,installRepository } = this.cliMgr;

    this.installStepList
      .add({
        id: INSTALL_STEP.CLONE,
        emoji: '🚚',
        message: `Cloning '${installRepository}' into '${projectName}'...`,
        cmd: `git clone https://github.com/${ORGANIZATION}/${installRepository}.git ${projectName}`,
      })
      .add({
        id: INSTALL_STEP.UPDATE_PACKAGE,
        emoji: '✏️ ',
        message: 'Updating package...',
        // fn: this.updatePackage.bind(this),
      })
      .add({
        id: INSTALL_STEP.NPM_INSTALL,
        emoji: '📦',
        message: 'Installing packages...',
        cmd: `npm --prefix ${projectName} install`,
      })
      .add({
        id: INSTALL_STEP.CLEANUP,
        emoji: '🧹',
        message: 'Cleaning up...',
        cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
      });
  }
}
