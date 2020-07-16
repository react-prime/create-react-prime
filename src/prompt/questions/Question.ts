import os from 'os';
import * as i from 'types';
import { Question as InquirerQuestion } from 'inquirer';
import { LOG_PREFIX } from 'src/constants';
import Text from 'utils/Text';


export default class Question implements i.CRPQuestion<InquirerQuestion> {
  protected text = new Text();
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
