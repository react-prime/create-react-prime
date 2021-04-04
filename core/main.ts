import * as i from 'types';
import color from 'kleur';

import Logger from 'core/Logger';
import Prompt from 'core/Prompt';
import cliMgr from 'core/CLIMgr';

import Module from 'modules/Module';


async function bootstrap() {
  const module = new Module();
  const logger = new Logger();


  // Startup msg
  const packageName = color.yellow().bold(process.env.NAME!);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);


  // Run installer
  let installer!: i.Installer;

  const prePrompt = new Prompt('pre');
  await prePrompt.ask();

  logger.whitespace();

  for await (const Installer of module.imports) {
    installer = new Installer() as i.Installer;

    if (installer.name === cliMgr.getBoilerplate()) {
      // TODO: Prompt questions from installer
      try {
        installer.beforeInstall?.();
        await installer.steps.execute();
        installer.afterInstall?.();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  const postPrompt = new Prompt('post');
  await postPrompt.ask();


  // Exit node process
  process.exit();
}

bootstrap();
