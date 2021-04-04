import { Answers } from 'inquirer';

import CLIMgr from 'core/CLIMgr';
import Question from 'core/decorators/Question';


@Question({
  type: 'list',
  name: 'boilerplate',
  message: 'What boilerplate would you like to install?',
  choices: ['react-spa', 'react-ssr', 'react-native'],
  default: '',
  beforeInstall: true,
})
class BoilerplateQuestion {
  when = (): boolean => {
    const cliMgr = new CLIMgr();

    return cliMgr.getBoilerplate() ? false : true;
  }

  answer = (answers: Answers): void => {
    const cliMgr = new CLIMgr();

    cliMgr.setBoilerplate(answers.boilerplate);
  }
}

export default BoilerplateQuestion;
