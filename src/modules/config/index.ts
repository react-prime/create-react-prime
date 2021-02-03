import * as i from '../../core/types';

import JsDefaultSteps from '../steps/js/Default';
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
