import fs from 'fs/promises';
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import type { PackageJson } from 'type-fest';
import { state, createSpinner, asyncExec } from '@crp';

import {
  addDependenciesFromPackage,
  getPackageJson,
} from '../../shared/actions';

// Loop all files in the component folder with .tsx or .ts extension
// Rename Storybook internal resolvers to project related resolvers
async function renameStorybookResolvers(
  destCommonFolder: string,
): Promise<void> {
  for await (const file of readdirSync(destCommonFolder)) {
    const filePath = `${destCommonFolder}/${file}`;
    const ext = path.extname(filePath);
    if (ext !== '.tsx' && ext !== 'ts') {
      return;
    }

    const fileData = await fs.readFile(filePath, 'utf8');
    const replacedFileData = fileData
      .replaceAll('@labela/components/', 'common/')
      .replaceAll('src/', '')
      .replaceAll("/src'", "'");

    await fs.writeFile(filePath, replacedFileData);
  }
}

// Read component package.json and add dependencies to project
async function installAndCopyComponent(
  path: string,
  destFolder: string,
): Promise<PackageJson | null> {
  let pkg: PackageJson | null = null;

  // If the component folder already exists (previously installed, skip)
  if (existsSync(destFolder)) {
    return null;
  }

  if (existsSync(`${path}/package.json`)) {
    const { json } = await getPackageJson(`${path}/package.json`);
    pkg = json;

    // Save extra Label A components, so these can also be installed
    await addDependenciesFromPackage(pkg);
  }

  // Create component folder and copy /src folder from monorepo
  await asyncExec(
    `mkdir -p ${destFolder} && cp -r -n ${path}/src/. ${destFolder}`,
  );

  // Rename component Storybook resolvers to valid project resolvers
  await renameStorybookResolvers(destFolder);

  return pkg;
}

// Main action to install a component
export async function installComponent(component: string): Promise<void> {
  async function action() {
    const { projectName } = state.answers;

    const monorepoComponentsRoot = './prime-monorepo/components/web-components';
    const destCommonFolder = `${projectName}/src/components/common`;

    // Add extra Label A dependencies (e.g. DatePicker is dependend on FormField), if any are
    // returned from the initial installed component, loop over these and install + copy
    const pkg = await installAndCopyComponent(
      `${monorepoComponentsRoot}/${component}`,
      `${destCommonFolder}/${component}`,
    );

    if (pkg && pkg?.labela?.components) {
      const peerDependencies = pkg?.labela?.components;

      if (peerDependencies && peerDependencies.length > 0) {
        for (const dependency of peerDependencies) {
          await installAndCopyComponent(
            `${monorepoComponentsRoot}/${dependency}`,
            `${destCommonFolder}/${dependency}`,
          );
        }
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
