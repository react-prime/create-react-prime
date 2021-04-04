import os from 'os';
import { Answers } from 'inquirer';

import cliMgr from 'core/CLIMgr';
import Question from 'core/decorators/Question';


@Question({
  type: 'input',
  name: 'name',
  message: 'Project Name',
  beforeInstall: true,
})
class ProjectNameQuestion {
  when = (): boolean => {
    return cliMgr.getProjectName() ? false : true;
  }

  default = (answers: Answers): string => {
    return cliMgr.getBoilerplate() || answers.boilerplate || '';
  }

  validate = (input: string): string | boolean => {
    if (!input) {
      return false;
    }

    const hasIllegalChars = this.illegalChars.test(input);

    return hasIllegalChars
      ? 'Invalid folder name'
      : true;
  }

  answer = (answers: Answers): void => {
    cliMgr.setProjectName(answers.name);
  }

  private get illegalChars(): RegExp {
    // source: https://kb.acronis.com/content/39790
    switch (os.type()) {
      case 'WINDOWS_NT':
        return /[\^\\/?*:|"<> ]+/;
      case 'Darwin':
        // / is allowed but produces unwanted results
        return /[\/:]+/;
      case 'Linux':
      default:
        return /[\/]+/;
    }
  }
}

export default ProjectNameQuestion;
