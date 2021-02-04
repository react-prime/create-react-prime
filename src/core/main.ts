import 'reflect-metadata';
import * as i from 'types';
import color from 'kleur';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import Logger from 'core/utils/Logger';

async function main(): Promise<void> {
  // Startup message
  const logger = new Logger();
  const packageName = color.yellow().bold(process.env.NAME!);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);

  // Get app instance from IOC container and start installation
  const app = container.get<i.AppType>(SERVICES.App);

  // Run application
  await app.prompt('pre');
  await app.install();
  await app.prompt('post');

  app.end();

  // Exit Node process
  process.exit();
}

main();
