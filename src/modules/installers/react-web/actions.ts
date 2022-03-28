import cp from 'child_process';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { state, logger, createSpinner, asyncExec } from '@crp';

import { downloadMonorepo } from '../shared/actions';

import * as question from '../../questions';

export async function installModules(): Promise<void> {
  for await (const module of state.answers.modules || []) {
    switch (module) {
      case 'api-helper':
        await installApiHelper();
        break;
      case 'manual-deploy':
        await installDeployScript();
        break;
      case 'continuous-deploy':
        await installContinuousDeployScript();
        break;
      case 'sentry':
        await installSentry();
        break;
    }
  }
}

export async function installApiHelper(): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  async function action() {
    // Make sure monorepo is present
    if (!existsSync('prime-monorepo')) {
      await downloadMonorepo();
    }

    // Generate services folder path
    const servicesFolderPath =
      boilerplate === 'react-web'
        ? `${projectName}/src/services`
        : `${projectName}/src/app/services`;

    // Copy api-helper code to project's services folder
    await asyncExec(
      `cp -r ./prime-monorepo/packages/api-helper/src ${servicesFolderPath}/api`,
    );
    // Add api-helper dependencies without installing
    await asyncExec(
      `npx add-dependencies ${projectName}/package.json isomorphic-fetch`,
    );
  }

  const spinner = createSpinner(() => action(), {
    /* eslint-disable quotes */
    name: 'api-helper install',
    start: "📡  Installing 'api-helper'...",
    success: "📡  Installed 'api-helper'!",
    fail: "📡  Something went wrong while installing the 'api-helper'.",
    /* eslint-enable */
  });

  await spinner.start();

  // Ask user for the API base URL
  logger.whitespace();
  const baseUrl = await question.apiHelperBaseUrl();
  const configPath = `${projectName}/src/services/api/config.ts`;

  if (baseUrl && baseUrl.length > 0) {
    const raw = await fs.readFile(configPath, 'utf8');
    // eslint-disable-next-line quotes
    const next = raw.replace("apiUrl: ''", `apiUrl: '${baseUrl}'`);
    await fs.writeFile(configPath, next);

    logger.msg(
      `Updated the 'api-helper' config to use '${baseUrl}' as base URL`,
    );
  } else {
    logger.msg(
      // eslint-disable-next-line quotes
      "You can change the base URL of the 'api-helper' config in 'services/api/config.ts' later when needed",
    );
  }

  logger.whitespace();
}

export async function installDeployScript(): Promise<void> {
  async function action() {
    // Make sure monorepo is present
    if (!existsSync('prime-monorepo')) {
      await downloadMonorepo();
    }

    const { projectName } = state.answers;

    await asyncExec(
      `npx add-dependencies ${projectName}/package.json @labela/deploy --dev`,
    );
    await fs.copyFile(
      './prime-monorepo/packages/deploy-script/deploy.sh',
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

export async function installContinuousDeployScript(): Promise<void> {
  async function action() {
    const { projectName } = state.answers;

    await asyncExec(
      `npx add-dependencies ${projectName}/package.json @labela/continuous-deploy --dev`,
    );
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
    'Continuous-deploy script has been installed but requires some manual steps! Make sure to follow the instructions at https://github.com/sandervspl/prime-monorepo/tree/main/packages/continuous-deploy-script#readme',
  );
  logger.whitespace();
}

export async function installSentry(): Promise<void> {
  async function action() {
    // Make sure monorepo is present
    if (!existsSync('prime-monorepo')) {
      await downloadMonorepo();
    }

    const { projectName, boilerplate } = state.answers;

    await asyncExec(
      `npx add-dependencies ${projectName}/package.json @sentry/nextjs`,
    );

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
        `cp -r -n ./prime-monorepo/packages/sentry-setup/pages ${projectName}/src`,
      );

      // Edit NextJS config file
      const configFile = await fs.readFile(
        `${projectName}/next.config.js`,
        'utf8',
      );

      /* eslint-disable quotes */
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
      /* eslint-enable */

      await fs.writeFile(`${projectName}/next.config.js`, nextConfigFile);

      // Fix formatting
      await asyncExec(
        `npx prettier --single-quote --trailing-comma all --write ${projectName}/next.config.js`,
      );
    }
  }

  const spinner = createSpinner(() => action(), {
    name: 'sentry install',
    /* eslint-disable quotes */
    start: ' ▲  Setting up Sentry...',
    success: ' ▲  Sentry was set up succesfully!',
    fail: ' ▲  Something went wrong while setting up Sentry.',
    /* eslint-enable */
  });

  await spinner.start();
}
