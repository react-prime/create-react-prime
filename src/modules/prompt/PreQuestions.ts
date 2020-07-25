import * as i from 'types';

import Questions from 'core/Questions';

import InstallType from './question/InstallType';
import ProjectName from './question/ProjectName';


export default class PreQuestions extends Questions implements i.QuestionsType {
  /**
   * List of questions
   */
  init(): i.CRPQuestion[] {
    return [
      new InstallType(this.cliMgr),
      new ProjectName(this.cliMgr),
    ];
  }
}
