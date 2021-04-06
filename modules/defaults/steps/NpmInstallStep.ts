import * as i from 'types';

import Step from 'core/decorators/Step';


@Step({
  name: 'npm_install',
  spinner: {
    emoji: '📦',
    message: {
      pending: () => 'Installing packages...',
      success: () => 'Installed packages!',
    },
  },
})
export class NpmInstallStep {
  on(): void {
    return;
  }
}
