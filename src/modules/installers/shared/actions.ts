import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { PackageJson } from 'type-fest';
// prettier-ignore
import { state, logger, createSpinner, asyncExec } from '@crp';
import * as cli from '@crp/cli';
import { ERROR_TEXT } from '@crp/constants';

import * as question from '../../questions';

export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  async function action() {
    // Check if a directory with this name already exists
    if (projectName !== '.' && existsSync(projectName)) {
      // Throw so that spinner fails and shows this error
      throw new Error(ERROR_TEXT.DirectoryExists.replace('%s', projectName));
    }

    await asyncExec(`git clone ${url}`);
  }

  const text = (() => {
    if (cli.getOptions().modules) {
      return {
        name: 'clone',
        start: '🚚  Cloning modules into project...',
        success: '🚚  Cloned modules!',
        fail: '🚚  Something went wrong while cloning modules into project.',
      };
    }

    return {
      name: 'clone',
      start: `🚚  Cloning '${boilerplate}' into '${projectName}'...`,
      success: `🚚  Cloned '${boilerplate}' into '${projectName}'!`,
      fail: `🚚  Something went wrong while cloning '${boilerplate}' into '${projectName}'.`,
    };
  })();

  const spinner = createSpinner(() => action(), text);

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

// Helper to get path to the project's package.json + JS object of its content
export async function getPackageJson(
  pkgFile: string,
): Promise<never | { path: string; json: PackageJson }> {
  const projectPkgPath = path.resolve(pkgFile);
  const pkgStr = await (async () => {
    // Silently fail if package.json doesn't exist
    try {
      const raw = await fs.readFile(projectPkgPath, 'utf8');
      const parsed = JSON.parse(raw) as PackageJson;
      const copy = { ...parsed };

      return copy;
    } catch (err) {}
  })();

  if (!pkgStr) {
    await logger.error(ERROR_TEXT.PkgNotFound, projectPkgPath);
  }

  return {
    path: projectPkgPath,
    json: pkgStr!,
  };
}

// Helper to add dependencies to a package.json (without installing)
export async function addDependenciesFromPackage(
  pkg: PackageJson,
): Promise<void> {
  const { projectName } = state.answers;
  const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : null;

  // Filter out dependencies that are LabelA components
  const npmDependencies = dependencies?.filter(
    (d) => !d.includes('@labela/components'),
  );

  if (npmDependencies && npmDependencies.length > 0) {
    await asyncExec(
      `npx add-dependencies ${projectName}/package.json ${npmDependencies.join(
        ' ',
      )}`,
    );
  }

  const devDependencies = pkg.devDependencies
    ? Object.keys(pkg.devDependencies)
    : null;

  if (devDependencies && devDependencies.length > 0) {
    await asyncExec(
      `npx add-dependencies ${projectName}/package.json ${devDependencies.join(
        ' ',
      )} -D`,
    );
  }
}

// Helper to extract LabelA component dependencies from package.json
export async function getLabelAPeerDependencies(
  pkg: PackageJson,
): Promise<string[] | null> {
  const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : null;

  const labelaDependencies = dependencies?.filter((d) =>
    d.includes('@labela/components'),
  );

  return labelaDependencies || null;
}

export async function npmPackageUpdate(): Promise<void> {
  const { projectName, boilerplate } = state.answers;

  // The action that will update the content of the project's package.json
  async function action(): Promise<void> {
    const { path, json: pkg } = await getPackageJson(
      `${projectName}/package.json`,
    );
    const { json: boilerplatePkg } = await getPackageJson(
      `./prime-monorepo/boilerplates/${boilerplate}/package.json`,
    );

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
    pkg.labela = {
      boilerplate: {
        name: boilerplate,
        version: boilerplatePkg.version || '1.0.0',
      },
    };

    // Write to package.json
    await fs.writeFile(path, JSON.stringify(pkg, null, 2));
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

  await asyncExec(
    `cp -r ./prime-monorepo/boilerplates/${boilerplate} ${projectName}`,
  );

  // Update eslint config base path
  await fs.copyFile(
    './prime-monorepo/.eslintrc',
    `${projectName}/.eslintrc.base.json`,
  );

  const raw = await fs.readFile(`${projectName}/.eslintrc`, 'utf8');
  const next = raw.replace('../../.eslintrc', '.eslintrc.base.json');

  await fs.writeFile(`${projectName}/.eslintrc`, next);
}

export async function downloadMonorepo(): Promise<void> {
  // Check if a prime-monorepo directory already exists
  if (existsSync('prime-monorepo')) {
    await logger.error(ERROR_TEXT.DirectoryExists, 'prime-monorepo');
  }

  await clone('https://github.com/LabelA/prime-monorepo.git');
}

export async function removeMonorepo(): Promise<void> {
  await asyncExec('rm -rf ./prime-monorepo');
}

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
    /* eslint-disable quotes */
    name: `${apiPackage} install`,
    start: `📡  Installing '${apiPackage}'...`,
    success: `📡  Installed '${apiPackage}'!`,
    fail: `📡  Something went wrong while installing the '${apiPackage}'.`,
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
      `Updated the '${apiPackage}' config to use '${baseUrl}' as base URL`,
    );
  } else {
    logger.msg(
      // eslint-disable-next-line quotes
      `You can change the base URL of the '${apiPackage}' config in 'services/api/config.ts' later when needed`,
    );
  }

  logger.whitespace();
}
