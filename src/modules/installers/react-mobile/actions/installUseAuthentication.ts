import { state, createSpinner, asyncExec } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';

export async function installUseAuthentication(): Promise<void> {
  async function action() {
    const { projectName } = state.answers;

    const hookFolderName = 'useAuthentication';

    const monorepoRoot = `./${DOWNLOADED_MONOREPO_FOLDER_NAME}/packages/mobile-packages/use-authentication`;
    const destFolder = `${projectName}/src/services/hooks/${hookFolderName}`;

    // Create component folder and copy /src folder from monorepo
    await asyncExec(
      `mkdir -p ${destFolder} && cp -r -n ${monorepoRoot}/src. ${destFolder}`,
    );
  }

  const spinner = createSpinner(() => action(), {
    name: '🚀  useAuthentication install',
    start: ' 🚀  Installing useAuthentication...',
    success: '🚀  Installed useAuthentication!',
    fail: "🚀  Something went wrong while installing 'useAuthentication'.",
  });

  await spinner.start();
}
