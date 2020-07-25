import * as i from 'types';
import color from 'kleur';

import SERVICES from 'core/ioc/services';
import Logger from 'core/utils/Logger';


async function main(): Promise<void> {
  // Startup message
  const logger = new Logger();
  const packageName = color.yellow().bold(process.env.npm_package_name!);
  const version = process.env.npm_package_version;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);

  // Get app instance from IOC container and start installation
  const container = (await import('core/ioc/container')).default;
  const app = container.get<i.AppType>(SERVICES.App);

  // Run application
  await app.form('pre');
  await app.install();
  await app.form('post');

  app.end();

  // Exit Node process
  process.exit();
}

main();
