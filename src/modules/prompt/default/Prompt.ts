import * as i from 'types';

import Prompt from 'core/Prompt';

import Boilerplate from './question/boilerplate';
import ProjectName from './question/ProjectName';
import SelectEditor from './question/SelectEditor';


export default class DefaultPrompt extends Prompt {
  beforeInstall(): i.CRPQuestion[] {
    return [
      new Boilerplate(this.cliMgr),
      new ProjectName(this.cliMgr),
    ];
  }

  afterInstall(): i.CRPQuestion[] {
    return [
      new SelectEditor(this.cliMgr),
    ];
  }
}
