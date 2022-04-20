import { state } from '@crp';
import { createSpinner, asyncExec } from '@crp/utils';

export async function podInstall(): Promise<void> {
  const { projectName } = state.answers;

  async function action(): Promise<void> {
    await asyncExec('pod install', {
      cwd: `${projectName}/ios`,
    });
  }

  const spinner = createSpinner(() => action(), {
    name: 'pod install',
    start: `🔤  Installing iOS Podfile for '${projectName}'...`,
    success: `🔤  Installed iOS dependencies for '${projectName}'!`,
    fail: `🔤  Something went wrong while installing Podfile for '${projectName}'.`,
  });

  await spinner.start();
}
