import * as i from 'types';

import JsDefaultSteps from 'modules/steps/js/Default';
import jsBoilerplates from './js/boilerplates';
import jsInstructions from './js/instructions';


const installersConfig: i.InstallersConfig = {
  js: {
    steps: JsDefaultSteps,
    boilerplates: jsBoilerplates,
    instructions: jsInstructions,
  },
  // python: {},
};

export default installersConfig;
