import type * as i from 'types';

import { answersProxy } from './proxy';


const state: i.State = {
  answers: new Proxy({} as i.CRPAnswers, answersProxy),
};

export default state;
