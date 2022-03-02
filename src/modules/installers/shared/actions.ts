import fs from 'fs';
import path from 'path';
import type { PackageJson } from 'type-fest';
import { state, logger, createSpinner, asyncExec, asyncExists, asyncWrite } from '@crp';
import { ERROR_TEXT } from '@crp/constants';


export async function clone(url: string): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  async function action() {
    // Check if directory already exists
    if (await asyncExists(projectName)) {
      logger.error(ERROR_TEXT.DirectoryExists, projectName);
    }

    await asyncExec(`git clone ${url} ${projectName}`);
  }

  const spinner = createSpinner(
    () => action(),
    {
      name: 'clone',
      start: `🚚  Cloning '${boilerplate}' into '${projectName}'...`,
      success: `🚚  Cloned '${boilerplate}' into '${projectName}'!`,
      fail: `🚚  Something went wrong while cloning '${boilerplate}' into '${projectName}'.`,
    },
  );

  await spinner.start();
}


export async function npmInstall(): Promise<void> {
  const { projectName } = state.answers;

  const spinner = createSpinner(
    () => asyncExec(`npm --prefix ${projectName} install`),
    {
      name: 'npm install',
      start: '📦  Installing packages...',
      success: '📦  Installed packages!',
      fail: `📦  Something went wrong while NPM installing '${projectName}'.`,
    },
  );

  await spinner.start();
}


export async function npmPackageUpdate(): Promise<void> {
  const { projectName } = state.answers;

  // Helper to get path to the project's package.json + JS object of its content
  function getPackageJson(): never | { path: string; json: PackageJson } {
    const projectPkgPath = path.resolve(`${projectName}/package.json`);
    const pkgStr = (() => {
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
  async function updatePackageJson(): Promise<void> {
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

  const spinner = createSpinner(
    () => updatePackageJson(),
    {
      name: 'package.json update',
      start: '✏️  Updating package.json...',
      success: '✏️  Updated package.json!',
      fail: `✏️  Something went wrong while updating package.json for '${projectName}'.`,
    },
  );

  await spinner.start();
}


export async function cleanup(): Promise<void> {
  const { projectName } = state.answers;

  const spinner = createSpinner(
    () => asyncExec(`rm -rf ${projectName}/.git ${projectName}/.travis.yml`),
    {
      name: 'cleanup',
      start: '🧹  Cleaning up...',
      success: '🧹  Cleaned up!',
      fail: `🧹  Something went wrong while cleaning up files for '${projectName}'.`,
    },
  );

  await spinner.start();
}
