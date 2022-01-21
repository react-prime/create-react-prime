import * as i from 'types';

import Option from 'core/decorators/Option';
import Logger from 'core/Logger';
import settingsMgr from 'core/SettingsMgr';


@Option<boolean>({
  flags: '-la, --labela',
  description: 'Toggles whether you are a Label A employee.',
  defaultValue: false,
  terminate: true,
})
export class LabelAOption implements i.CLIOptionClass<boolean> {
  on(flags: i.Opts): void {
    if (flags.labela == null) {
      return;
    }

    // Toggle state
    const newVal = settingsMgr.write('labela', !settingsMgr.read('labela'));

    new Logger().msg('Label A employee status was set to', newVal);
  }
}
