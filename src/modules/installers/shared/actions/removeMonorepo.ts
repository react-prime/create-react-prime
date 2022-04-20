import { asyncExec } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';

export async function removeMonorepo(): Promise<void> {
  await asyncExec(`rm -rf ./${DOWNLOADED_MONOREPO_FOLDER_NAME}`);
}
