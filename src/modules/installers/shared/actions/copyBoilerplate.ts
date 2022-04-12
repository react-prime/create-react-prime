import fs from 'fs/promises';
import { state, asyncExec } from '@crp';

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
