import { state, createSpinner, asyncExec } from '@crp';

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
