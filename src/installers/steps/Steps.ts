import * as i from 'types';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';
import STEPS from './identifiers';


@injectable()
export default class Steps extends Array<i.InstallStepOptions> implements i.StepsType {
  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
  ) {
    super();

    const steps = this.init();

    const { installationConfig, projectName } = cliMgr;
    const repoName = installationConfig?.repository;
    const vc = installationConfig?.vc;

    /**
     * Installation steps
     * These steps are required to run a proper installation
     */
    this.push(
      {
        id: STEPS.Clone,
        emoji: '🚚',
        message: {
          pending: `Cloning '${repoName}' into '${projectName}'...`,
          success: `Cloned '${repoName}' into '${projectName}'!`,
        },
        cmd: `git clone https://${vc?.host}/${vc?.owner}/${repoName}.git ${projectName}`,
      },
      ...steps,
      {
        id: STEPS.Cleanup,
        emoji: '🧹',
        message: {
          pending: 'Cleaning up...',
          success: 'Cleaned up!',
        },
        cmd: `rm -rf ${projectName}/.git ${projectName}/.travis.yml`,
      },
    );
  }


  /**
   * Add any additional steps with this method. These steps will be executed after cloning,
   * and before cleaning up (the last step)
   * */
  init(): i.InstallStepOptions[] { return []; }
}
