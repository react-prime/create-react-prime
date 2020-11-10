import * as i from 'types';

import JsSteps from 'modules/steps/js/Steps';
import jsType from './js/type';
import jsInstructions from './js/instructions';


const installersConfig: i.InstallersConfig = {
  js: {
    steps: JsSteps,
    type: jsType,
    instructions: jsInstructions,
  },
  // python: {},
};

export default installersConfig;
