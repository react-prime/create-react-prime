import * as i from 'types';

import Step from 'core/decorators/Step';


@Step({
  name: 'clone',
})
export class CloneStep {
  on(options: i.StepOptions): void {
    return;
  }
}

