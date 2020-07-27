import util from 'util';
import cp from 'child_process';
import os from 'os';
import * as i from 'types';
import { Question as InquirerQuestion } from 'inquirer';

import { LOG_PREFIX } from 'core/constants';


export default class Question implements i.CRPQuestion<InquirerQuestion> {
  protected exec = util.promisify(cp.exec);
  protected macOnly = false;
  protected optional = false;
  readonly prefix = LOG_PREFIX;


  get isValidForOS(): boolean {
    if (this.macOnly && os.type() !== 'Darwin') {
      return false;
    }

    return true;
  }

  get isOptional(): boolean {
    return this.optional;
  }
}
