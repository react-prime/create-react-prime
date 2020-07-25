import * as i from 'types';

import Questions from 'core/Questions';

import SelectEditor from './question/SelectEditor';


export default class PostQuestions extends Questions implements i.QuestionsType {
  /**
   * List of questions
   */
  init(): i.CRPQuestion[] {
    return [
      new SelectEditor(this.cliMgr),
    ];
  }
}
