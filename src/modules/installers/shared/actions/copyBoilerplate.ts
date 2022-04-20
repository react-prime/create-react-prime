import fs from 'fs/promises';
import { state, asyncExec } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';

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

  await fs.writeFile(`${projectName}/.eslintrc`, next);
}
