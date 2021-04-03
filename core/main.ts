import * as i from 'types';
import color from 'kleur';

import CLIMgr from 'core/CLIMgr';
import Logger from 'core/Logger';
import Module from 'modules/Module';


function bootstrap() {
  const module = new Module();
  const cliMgr = new CLIMgr();
  const logger = new Logger();


  // Startup msg
  const packageName = color.yellow().bold(process.env.NAME!);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);


  // Run installer
  let installer!: i.Installer;

  for (const Installer of module.imports) {
    installer = new Installer() as i.Installer;

    if (installer.name === cliMgr.getBoilerplate()) {
      installer.beforeInstall?.();
      installer.steps.execute();
      installer.afterInstall?.();
    }
  }

  // Exit node process
  process.exit();
}

bootstrap();
