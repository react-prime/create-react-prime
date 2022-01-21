import CLIOptions from 'core/CLIOptions';

import { LabelAOption } from './labela.option';
import { BoilerplateAOption } from './boilerplate.option';


export default class cliOptions extends CLIOptions {
  options = [
    BoilerplateAOption,
    LabelAOption,
  ]
}
