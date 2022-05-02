import fs from 'fs/promises';
import type { JsonObject } from 'type-fest';
import { state, asyncExec } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';

type EslintJsonObject = JsonObject & {
  settings?: {
    next?: {
      rootDir?: string[];
    };
  };
};

export async function copyBoilerplate(): Promise<void> {
  const { boilerplate, projectName } = state.answers;

  await asyncExec(
    `cp -r ./${DOWNLOADED_MONOREPO_FOLDER_NAME}/boilerplates/${boilerplate} ${projectName}`,
  );

  // Update eslint config base path
  await fs.copyFile(
    `./${DOWNLOADED_MONOREPO_FOLDER_NAME}/.eslintrc`,
    `${projectName}/.eslintrc.base.json`,
  );

  const raw = await fs.readFile(`${projectName}/.eslintrc`, 'utf8');
  const next = raw.replace('../../.eslintrc', '.eslintrc.base.json');

  const eslintJson: EslintJsonObject = JSON.parse(
    await fs.readFile(`${projectName}/.eslintrc.base.json`, 'utf8'),
  );

  // Delete the next settings if they exist. These are only required for the monorepo
  if (eslintJson?.settings?.next != null) {
    delete eslintJson.settings.next;

    await fs.writeFile(
      `${projectName}/.eslintrc.base.json`,
      JSON.stringify(eslintJson, null, 2),
    );
  }

  await fs.writeFile(`${projectName}/.eslintrc`, next);
}
