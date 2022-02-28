import type * as i from 'types';

import { answersProxy } from './proxy';


function createState(): i.State {
  return {
    answers: new Proxy({} as i.CRPAnswers, answersProxy),
  };
}

const state = createState();

export { state, createState };
