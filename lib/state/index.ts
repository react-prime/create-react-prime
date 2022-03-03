import type * as i from 'types';

import { answersProxy } from './proxy';


function createState(): i.State {
  return {
    answers: new Proxy({} as i.CRPAnswers, answersProxy),
    session: {
      id: '',
      result: 'pending',
    },
  };
}

const state = createState();

export { state, createState };
