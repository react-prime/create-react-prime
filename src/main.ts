import * as i from 'types';
import color from 'kleur';
import Logger from 'utils/Logger';
import SERVICES from 'ioc/services';


// Startup message
const logger = new Logger();
const packageName = color.yellow().bold(process.env.npm_package_name!);
const version = process.env.npm_package_version;
logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}\n`);


async function main(): Promise<void> {
  // Get app instance from IOC container and start installation
  const container = (await import('ioc/container')).default;
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
