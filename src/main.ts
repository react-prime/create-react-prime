import Logger from 'utils/Logger';
import * as i from 'types';
import SERVICES from 'ioc/services';
import Text from 'utils/Text';


// Startup message
const logger = new Logger();
const text = new Text();
const { npm_package_name, npm_package_version } = process.env;
const packageName = text.yellow(text.bold(npm_package_name!));

logger.msg(`${packageName} v${npm_package_version} ${text.gray('(ctrl + c to exit)')}\n`);


async function main(): Promise<void> {
  // Get app instance from IOC container and start installation
  const container = (await import('ioc')).default;
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
