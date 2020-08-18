import * as i from 'types';

import STEPS from 'modules/steps/identifiers';

import JsSteps from './Steps';


// Extend JsSteps instead of Steps because we want all the steps from a JS installation
export default class NativeSteps extends JsSteps {
  init(): i.InstallStepOptions[] {
    // Get base install steps from JsSteps
    const steps = super.init();

    // Remove and save the last step
    const lastStep = steps.pop();

    // Create native scripts step
    const { projectName } = this.cliMgr;
    const nativeScriptsStep = this.verifyStep({
      id: STEPS.RunNativeScripts,
      emoji: '🔤',
      message: {
        pending: `Renaming project files to '${projectName}'...`,
        success: `Renamed project files to '${projectName}'!`,
      },
    });

    // Add native scripts step and the removed step back to the steps array
    steps.push(nativeScriptsStep);
    steps.push(lastStep!);

    return steps;
  }
}
