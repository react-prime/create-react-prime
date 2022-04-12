import fs from 'fs/promises';
import { existsSync } from 'fs';
import { state, logger, createSpinner, asyncExec } from '@crp';

import * as question from '../../../questions';

import { addDependenciesFromPackage } from './addDependenciesFromPackage';
import { downloadMonorepo } from './downloadMonorepo';
import { getPackageJson } from './getPackageJson';

export async function installApiHelper(): Promise<void> {
  const { projectName, boilerplate } = state.answers;

  const isMobile = boilerplate === 'react-mobile';
  const apiPackage = isMobile
    ? 'mobile-packages/api-helper'
    : 'web-packages/api-helper';

  async function action() {
    // Make sure monorepo is present
    if (!existsSync('prime-monorepo')) {
      await downloadMonorepo();
    }

    // Generate services folder path
    const servicesFolderPath = `${projectName}/src/services`;
    const packagePath = `./prime-monorepo/packages/${apiPackage}`;

    // Copy api-helper code to project's services folder
    await asyncExec(`cp -r ${packagePath}/src ${servicesFolderPath}/api`);

    const { json: pkg } = await getPackageJson(`${packagePath}/package.json`);
    await addDependenciesFromPackage(pkg);
  }

  const spinner = createSpinner(() => action(), {
    name: `${apiPackage} install`,
    start: `📡  Installing '${apiPackage}'...`,
    success: `📡  Installed '${apiPackage}'!`,
    fail: `📡  Something went wrong while installing the '${apiPackage}'.`,
  });

  await spinner.start();

  // Ask user for the API base URL
  logger.whitespace();
  const baseUrl = await question.apiHelperBaseUrl();
  const configPath = `${projectName}/src/services/api/config.ts`;

  if (baseUrl && baseUrl.length > 0) {
    const raw = await fs.readFile(configPath, 'utf8');
    const next = raw.replace("apiUrl: ''", `apiUrl: '${baseUrl}'`);
    await fs.writeFile(configPath, next);

    logger.msg(
      `Updated the '${apiPackage}' config to use '${baseUrl}' as base URL`,
    );
  } else {
    logger.msg(
      `You can change the base URL of the '${apiPackage}' config in 'services/api/config.ts' later when needed`,
    );
  }

  logger.whitespace();
}
