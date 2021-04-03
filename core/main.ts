import * as i from 'types';

import Module from 'modules/Module';

import CLIMgr from './CLIMgr';


function bootstrap() {
  const module = new Module();
  const cliMgr = new CLIMgr();

  let installer!: i.Installer;

  for (const Installer of module.imports) {
    installer = new Installer() as i.Installer;

    if (installer.name === cliMgr.getBoilerplate()) {
      installer.beforeInstall?.();
      installer.steps.execute();
      installer.afterInstall?.();
    }
  }

  process.exit();
}

bootstrap();
