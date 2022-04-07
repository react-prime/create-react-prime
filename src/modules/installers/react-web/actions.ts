import cp from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import { state, logger, createSpinner, asyncExec } from '@crp';

import {
  addDependenciesFromPackage,
  downloadMonorepo,
  getPackageJson,
  installApiHelper,
} from '../shared/actions';

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

export async function installComponents(): Promise<void> {
  for await (const component of state.answers.components || []) {
    await installComponent(component);
  }
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

export async function installComponent(component: string): Promise<void> {
  async function action() {
    const { projectName } = state.answers;

    const webComponentsPath = './prime-monorepo/components/web-components';
    const componentPath = `${webComponentsPath}/${component}`;
    const commonFolder = `${projectName}/src/components/common`;

    const installAndCopyComponent = async (
      path: string,
      comp: string,
    ): Promise<string[] | null> => {
      // If the component folder already exists (previously installed, skip)
      const destFolder = `${commonFolder}/${comp}`;
      if (existsSync(destFolder)) return null;

      let extraInternalDependencies = null;
      // Read component package.json and add dependencies to project
      if (existsSync(`${path}/package.json`)) {
        const { json: pkg } = await getPackageJson(`${path}/package.json`);

        // Save extra Label A components, so these can also be installed
        const { labelaDependencies } = await addDependenciesFromPackage(pkg);
        extraInternalDependencies = labelaDependencies;
      }

      // Create component folder and copy /src folder from monorepo
      await asyncExec(
        `mkdir -p ${destFolder} && cp -r -n ${path}/src/. ${destFolder}`,
      );

      // Rename component Storybook resolvers to valid project resolvers
      await renameStorybookResolvers(destFolder);

      return extraInternalDependencies;
    };

    // Add extra Label A dependencies (e.g. DatePicker is dependend on FormField), if any are
    // returned from the initial installed component, loop over these and install + copy
    let extraInternalDependencies = null;
    extraInternalDependencies = await installAndCopyComponent(
      componentPath,
      component,
    );

    if (extraInternalDependencies && extraInternalDependencies.length > 0) {
      for (const dependency of extraInternalDependencies) {
        // Internal dependencies in the monorepo are linked via package.json with the @label prefix
        // e.g. "@labela/form/FormField" where the suffix is the folder name
        const extraComponent = dependency.replace('@labela/', '');
        const extraComponentPath = `${webComponentsPath}/${extraComponent}`;

        await installAndCopyComponent(extraComponentPath, extraComponent);
      }
    }
  }

  const spinner = createSpinner(() => action(), {
    name: `${component} script install`,
    start: ` 🚀  Installing '${component}'...`,
    success: ` 🚀  Installed '${component}'!`,
    fail: ` 🚀  Something went wrong while installing the '${component}'.`,
  });

  await spinner.start();
}

export async function renameStorybookResolvers(
  componentFolder: string,
): Promise<void> {
  // Loop all files in the component folder with .tsx or .ts extension
  // Rename Storybook internal resolvers to project related resolvers
  for await (const file of readdirSync(componentFolder)) {
    const filePath = `${componentFolder}/${file}`;

    const ext = path.extname(filePath);
    if (ext !== '.tsx' && ext !== 'ts') return;

    const fileData = await fs.readFile(filePath, 'utf8');
    const replacedFileData = fileData
      .replaceAll('@labela/common/', 'common/')
      .replaceAll('src/', '')
      .replaceAll("/src'", "'");

    await fs.writeFile(filePath, replacedFileData);
  }
}
