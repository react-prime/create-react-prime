import fs from 'fs/promises';
import { existsSync } from 'fs';
import { state, createSpinner, asyncExec } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';
import {
  addDependenciesFromPackage,
  downloadMonorepo,
  getPackageJson,
} from '../../shared/actions';

export async function installDeployScript(): Promise<void> {
  async function action() {
    // Make sure monorepo is present
    if (!existsSync(DOWNLOADED_MONOREPO_FOLDER_NAME)) {
      await downloadMonorepo();
    }

    const { projectName } = state.answers;

    if (existsSync(`${projectName}/package.json`)) {
      const { json: pkg } = await getPackageJson(`${projectName}/package.json`);
      await addDependenciesFromPackage(pkg);
    }

    await fs.copyFile(
      `./${DOWNLOADED_MONOREPO_FOLDER_NAME}/packages/web-packages/deploy-script/src/deploy.sh`,
      `${projectName}/deploy.sh`,
    );
    await asyncExec(`chmod +x ${projectName}/deploy.sh`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'deploy script install',
    start: " 🚀  Installing 'deploy-script'...",
    success: " 🚀  Installed 'deploy-script'!",
    fail: " 🚀  Something went wrong while installing the 'deploy-script'.",
  });

  await spinner.start();
}
