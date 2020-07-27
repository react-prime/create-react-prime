import * as i from 'types';

import Prompt from 'core/Prompt';

import InstallType from './question/InstallType';
import ProjectName from './question/ProjectName';
import SelectEditor from './question/SelectEditor';


export default class DefaultPrompt extends Prompt {
  beforeInstall(): i.CRPQuestion[] {
    return [
      new InstallType(this.cliMgr),
      new ProjectName(this.cliMgr),
    ];
  }

  afterInstall(): i.CRPQuestion[] {
    return [
      new SelectEditor(this.cliMgr),
    ];
  }
}
