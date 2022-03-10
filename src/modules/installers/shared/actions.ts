import fs from 'fs';
import path from 'path';
import type { PackageJson } from 'type-fest';
// prettier-ignore
import { state, logger, createSpinner, asyncExec, asyncExists, asyncWrite } from '@crp';
import { ERROR_TEXT } from '@crp/constants';

import * as question from '../../questions';

export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  async function action() {
    // Check if a prime-monorepo directory already exists
    if (await asyncExists('prime-monorepo')) {
      logger.error(ERROR_TEXT.DirectoryExists, 'prime-monorepo');
    }

    await asyncExec(`git clone ${url}`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'clone',
    start: `🚚  Cloning '${boilerplate}' into '${projectName}'...`,
    success: `🚚  Cloned '${boilerplate}' into '${projectName}'!`,
    fail: `🚚  Something went wrong while cloning '${boilerplate}' into '${projectName}'.`,
  });

  await spinner.start();
}

export async function npmInstall(): Promise<void> {
  const { projectName } = state.answers;

  async function action() {
    await asyncExec(`npm --prefix ${projectName} install`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'npm install',
    start: '📦  Installing packages...',
    success: '📦  Installed packages!',
    fail: `📦  Something went wrong while NPM installing '${projectName}'.`,
  });

  await spinner.start();
}

export async function npmPackageUpdate(): Promise<void> {
  const { projectName } = state.answers;

  // Helper to get path to the project's package.json + JS object of its content
  function getPackageJson(): never | { path: string; json: PackageJson } {
    const projectPkgPath = path.resolve(`${projectName}/package.json`);
    const pkgStr = (() => {
      // Silently fail if package.json doesn't exist
      try {
        const raw = fs.readFileSync(projectPkgPath, 'utf8');
        const parsed = JSON.parse(raw) as PackageJson;
        const copy = { ...parsed };

        return copy;
      } catch (err) {}
    })();

    if (!pkgStr) {
      logger.error(ERROR_TEXT.PkgNotFound, projectPkgPath);
    }

    return {
      path: projectPkgPath,
      json: pkgStr!,
    };
  }

  // The action that will update the content of the project's package.json
  async function action(): Promise<void> {
    const { path, json: pkg } = getPackageJson();

    // Overwrite boilerplate defaults
    pkg.name = projectName;
    pkg.version = '0.1.0';
    pkg.description = `Repository of ${projectName}`;
    pkg.author = 'Label A B.V. [labela.nl]';
    pkg.keywords = [];
    pkg.private = true;
    pkg.repository = {
      type: 'git',
      url: '',
    };

    // Write to package.json
    await asyncWrite(path, JSON.stringify(pkg, null, 2));
  }

  const spinner = createSpinner(() => action(), {
    name: 'package.json update',
    start: '✏️  Updating package.json...',
    success: '✏️  Updated package.json!',
    fail: `✏️  Something went wrong while updating package.json for '${projectName}'.`,
  });

  await spinner.start();
}

export async function cleanup(): Promise<void> {
  const { projectName } = state.answers;

  async function action() {
    await asyncExec(`rm -rf ${projectName}/.git ${projectName}/.travis.yml`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'cleanup',
    start: '🧹  Cleaning up...',
    success: '🧹  Cleaned up!',
    fail: `🧹  Something went wrong while cleaning up files for '${projectName}'.`,
  });

  await spinner.start();
}

export async function copyBoilerplate(): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  // Check if a directory with this name already exists
  if (await asyncExists(projectName)) {
    logger.error(ERROR_TEXT.DirectoryExists, projectName);
  }

  await asyncExec(
    `cp -r ./prime-monorepo/boilerplates/${boilerplate} ${projectName}`,
  );
}

export async function downloadMonorepo(): Promise<void> {
  await clone('https://github.com/sandervspl/prime-monorepo.git');
}

export async function removeMonorepo(): Promise<void> {
  await asyncExec('rm -rf ./prime-monorepo');
}

export async function installModules(): Promise<void> {
  for await (const module of state.answers.modules || []) {
    switch (module) {
      case 'api-helper':
        await installApiHelper();
        break;
    }
  }
}

export async function installApiHelper(): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  async function action() {
    // Make sure monorepo is present
    if (!fs.existsSync('prime-monorepo')) {
      await downloadMonorepo();
    }

    // Generate services folder path
    let servicesFolderPath = `${projectName}/src/services`;
    if (boilerplate === 'react-mobile') {
      servicesFolderPath = `${projectName}/src/app/services`;
    }

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
    const raw = fs.readFileSync(configPath, 'utf8');
    // eslint-disable-next-line quotes
    const next = raw.replace("apiUrl: ''", `apiUrl: '${baseUrl}'`);
    fs.writeFileSync(configPath, next);

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
