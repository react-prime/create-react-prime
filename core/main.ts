import * as i from 'types';
import color from 'kleur';

import Logger from 'core/Logger';
import Prompt from 'core/Prompt';
import cliMgr from 'core/CLIMgr';

import Module from 'modules/Module';
import MainPrompt from './MainPrompt';


async function bootstrap() {
  const module = new Module();
  const logger = new Logger();


  // Startup msg
  const packageName = color.yellow().bold(process.env.NAME!);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);


  // Run prompt
  const prompt = new MainPrompt();
  await prompt.ask('before');


  // Run installer
  let installer!: i.Installer;

  for await (const Installer of module.imports) {
    installer = new Installer() as i.Installer;

    if (installer.name === cliMgr.getBoilerplate()) {
      if (installer.questions) {
        const installerPrompt = new Prompt(installer.questions);
        await installerPrompt.ask('before');
      }

      logger.whitespace();

      try {
        installer.beforeInstall?.();
        await installer.steps.execute();
        installer.afterInstall?.();
      } catch (err) {
        logger.error(err);
      }

      logger.whitespace();

      if (installer.questions) {
        const installerPrompt = new Prompt(installer.questions);
        await installerPrompt.ask('after');
      }
    }
  }


  // Run prompt
  await prompt.ask('after');


  // Exit node process
  process.exit();
}

bootstrap();
