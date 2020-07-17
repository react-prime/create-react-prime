import Logger from 'utils/Logger';
import * as i from 'types';
import SERVICES from 'ioc/services';


// Startup message
const logger = new Logger();
logger.msg('create-react-prime v$version\n');


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
