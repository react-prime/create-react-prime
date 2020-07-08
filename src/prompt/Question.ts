import os from 'os';
import * as i from 'types';
import { Question as InquirerQuestion } from 'inquirer';
import { LOG_PREFIX } from 'src/constants';


export default class Question implements i.CRPQuestion<InquirerQuestion> {
  protected macOnly = false;
  readonly prefix = LOG_PREFIX;


  get isValidForOS(): boolean {
    if (this.macOnly && os.type() === 'Darwin') {
      return true;
    }

    return false;
  }
}
