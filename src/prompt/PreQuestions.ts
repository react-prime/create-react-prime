import * as i from 'types';
import Questions from './Questions';
import InstallType from './questions/InstallType';


export default class PreQuestions extends Questions implements i.QuestionsType {
  /**
   * List of questions
   */
  init(): i.CRPQuestion[] {
    return [
      new InstallType(this.cliMgr),
    ];
  }
}
