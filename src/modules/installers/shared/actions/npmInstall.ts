import { state, createSpinner, asyncExec } from '@crp';

export async function npmInstall(): Promise<void> {
  const { projectName } = state.answers;

  async function action() {
    await asyncExec(`npm --prefix ${projectName} install`);
  }

  const spinner = createSpinner(() => action(), {
    name: 'npm install',
    start: '📦  Installing packages...',
    success: '📦  Installed packages!',
    fail: `📦  Something went wrong while NPM installing '${projectName}'.`,
  });

  await spinner.start();
}
