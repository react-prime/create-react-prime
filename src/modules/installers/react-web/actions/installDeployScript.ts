import fs from 'fs/promises';
import { existsSync } from 'fs';
import { state, createSpinner, asyncExec } from '@crp';

import {
  addDependenciesFromPackage,
  downloadMonorepo,
  getPackageJson,
} from '../../shared/actions';

export async function installDeployScript(): Promise<void> {
  async function action() {
    // Make sure monorepo is present
    if (!existsSync('prime-monorepo')) {
      await downloadMonorepo();
    }

    const { projectName } = state.answers;

    if (existsSync(`${projectName}/package.json`)) {
      const { json: pkg } = await getPackageJson(`${projectName}/package.json`);
      await addDependenciesFromPackage(pkg);
    }

    await fs.copyFile(
      './prime-monorepo/packages/web-packages/deploy-script/src/deploy.sh',
      `${projectName}/deploy.sh`,
    );
    await asyncExec(`chmod +x ${projectName}/deploy.sh`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'deploy script install',
    /* eslint-disable quotes */
    start: " 🚀  Installing 'deploy-script'...",
    success: " 🚀  Installed 'deploy-script'!",
    fail: " 🚀  Something went wrong while installing the 'deploy-script'.",
    /* eslint-enable */
  });

  await spinner.start();
}
