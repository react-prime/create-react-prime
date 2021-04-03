import * as i from 'types';

import Step from 'core/decorators/Step';


@Step({
  name: 'npm_install',
})
export class NpmInstallStep {
  on(options: i.StepOptions): void {
    return;
  }
}
