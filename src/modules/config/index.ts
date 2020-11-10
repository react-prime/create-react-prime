import * as i from 'types';

import JsSteps from 'modules/steps/js/Steps';
import jsBoilerplates from './js/boilerplates';
import jsInstructions from './js/instructions';


const installersConfig: i.InstallersConfig = {
  js: {
    steps: JsSteps,
    boilerplates: jsBoilerplates,
    instructions: jsInstructions,
  },
  // python: {},
};

export default installersConfig;
