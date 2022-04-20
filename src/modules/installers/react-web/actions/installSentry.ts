import cp from 'child_process';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { state, createSpinner, asyncExec } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';
import {
  addDependenciesFromPackage,
  downloadMonorepo,
  getPackageJson,
} from '../../shared/actions';

export async function installSentry(): Promise<void> {
  async function action() {
    // Make sure monorepo is present
    if (!existsSync(DOWNLOADED_MONOREPO_FOLDER_NAME)) {
      await downloadMonorepo();
    }

    const { projectName, boilerplate } = state.answers;

    if (existsSync(`${projectName}/package.json`)) {
      const { json: pkg } = await getPackageJson(`${projectName}/package.json`);
      await addDependenciesFromPackage(pkg);
    }

    if (boilerplate === 'react-web') {
      // await asyncExec('npx @sentry/wizard -i nextjs', { cwd: projectName });
      cp.execSync('npx @sentry/wizard -i nextjs', {
        cwd: projectName,
        stdio: 'inherit',
      });

      // Remove unnecessary files
      const projectFiles = await fs.readdir(projectName, {
        withFileTypes: true,
      });

      // The Sentry wizard creates copy files if certain files already exist. Remove those files
      const wizardFiles = projectFiles
        .filter((dir) => dir.name.endsWith('wizardcopy.js'))
        .map((dir) => dir.name);

      await asyncExec(
        // prettier-ignore
        `rm -rf {${wizardFiles.join(',')},sentry.properties,src/pages/_error.js}`,
        {
          cwd: projectName,
        },
      );

      // Copy the error pages
      await asyncExec(
        `cp -r -n ./${DOWNLOADED_MONOREPO_FOLDER_NAME}/packages/web-packages/sentry-setup/src/pages ${projectName}/src`,
      );

      // Edit NextJS config file
      const configFile = await fs.readFile(
        `${projectName}/next.config.js`,
        'utf8',
      );

      const nextConfigFile = configFile
        .replace(
          "next/constants');",
          `next/constants');
        const { withSentryConfig } = require('@sentry/nextjs');`,
        )
        .replace(
          'module.exports = config;',
          `module.exports = withSentryConfig(config, {
          silent: true,
          debug: ['development', 'test'].includes(APP_ENV),
          release: \`\${process.env.npm_package_name}@\${process.env.npm_package_version}\`,
        });`,
        );

      await fs.writeFile(`${projectName}/next.config.js`, nextConfigFile);

      // Fix formatting
      await asyncExec(
        `npx prettier --single-quote --trailing-comma all --write ${projectName}/next.config.js`,
      );
    }
  }

  const spinner = createSpinner(() => action(), {
    name: 'sentry install',
    start: ' ▲  Setting up Sentry...',
    success: ' ▲  Sentry was set up succesfully!',
    fail: ' ▲  Something went wrong while setting up Sentry.',
  });

  await spinner.start();
}
