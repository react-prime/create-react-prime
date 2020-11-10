import * as i from 'types';

import STEPS from 'modules/steps/identifiers';

import JsDefaultSteps from './Default';


// Extend default steps with with steps for Native
export default class JsNativeSteps extends JsDefaultSteps {
  init(): i.InstallStepOptions[] {
    // Get all install steps from JsSteps
    const steps = super.init();

    // Remove and save the last step
    const lastStep = steps.pop();

    // Create native scripts step
    const { projectName } = this.cliMgr;
    const nativeScriptsStep: i.InstallStepOptions = {
      id: STEPS.RunNativeScripts,
      emoji: '🔤',
      message: {
        pending: `Renaming project files to '${projectName}'...`,
        success: `Renamed project files to '${projectName}'!`,
      },
    };

    // Add native scripts step and the removed step back to the steps array
    steps.push(nativeScriptsStep);
    steps.push(lastStep!);

    return steps;
  }
}
