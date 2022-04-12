import { existsSync } from 'fs';
import { state, logger, createSpinner } from '@crp';

import {
  addDependenciesFromPackage,
  getPackageJson,
} from '../../shared/actions';

export async function installContinuousDeployScript(): Promise<void> {
  async function action() {
    const { projectName } = state.answers;

    if (existsSync(`${projectName}/package.json`)) {
      const { json: pkg } = await getPackageJson(`${projectName}/package.json`);
      await addDependenciesFromPackage(pkg);
    }
  }

  const spinner = createSpinner(() => action(), {
    name: 'continuous-deploy script install',
    /* eslint-disable quotes */
    start: " 🚀  Installing 'continuous-deploy-script'...",
    success: " 🚀  Installed 'continuous-deploy-script'!",
    fail: " 🚀  Something went wrong while installing the 'continuous-deploy-script'.",
    /* eslint-enable */
  });

  await spinner.start();

  logger.msg(
    // eslint-disable-next-line max-len
    'Continuous-deploy script has been installed but requires some manual steps! Make sure to follow the instructions at https://github.com/LabelA/prime-monorepo/blob/main/packages/web-packages/continuous-deploy-script/README.md',
  );
  logger.whitespace();
}
