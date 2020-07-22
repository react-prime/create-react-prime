import * as i from 'types';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';

@injectable()
export default class Steps extends Array<i.InstallStepOptions> implements i.StepsType {
  constructor(
    @inject(SERVICES.CLIMgr) protected readonly cliMgr: i.CLIMgrType,
  ) {
    super();

    const steps = this.init();

    const { installationConfig: repositoryConfig, projectName } = cliMgr;
    const repoName = repositoryConfig?.repository;
    const vc = repositoryConfig?.vc;

    /**
     * Installation steps
     * These steps are required to run a proper installation
     *
     * @property {string,function} fn Can either be a direct reference to a function,
     * or a name reference to any method from an Installer instance as string
     */
    this.push(
      {
        id: 'clone',
        emoji: '🚚',
        message: {
          pending: `Cloning '${repoName}' into '${projectName}'...`,
          success: `Cloned '${repoName}' into '${projectName}'!`,
        },
        cmd: `git clone https://${vc?.host}/${vc?.owner}/${repoName}.git ${projectName}`,
      },
      ...steps,
      {
        id: 'cleanup',
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
