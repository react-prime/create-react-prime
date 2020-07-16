import * as i from 'types';
import Questions from './Questions';
import SelectEditor from './questions/SelectEditor';


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
