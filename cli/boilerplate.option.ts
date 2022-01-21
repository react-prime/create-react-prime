import * as i from 'types';

import Option from 'core/decorators/Option';
import scriptsMgr from 'core/ScriptsMgr';


@Option<string>({
  flags: '-b, --boilerplate <boilerplate>',
  description: `Install chosen boilerplate. Options: ${scriptsMgr.json().modules.join(', ')}`,
})
export class BoilerplateAOption implements i.CLIOptionClass<string> {}
