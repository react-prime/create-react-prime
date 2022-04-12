import fs from 'fs/promises';
import { state, createSpinner } from '@crp';

import { getPackageJson } from './getPackageJson';

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
