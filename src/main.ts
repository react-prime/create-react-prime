import * as i from 'types';
import container from 'ioc';
import SERVICES from 'ioc/services';


async function main(): Promise<void> {
  // Get app instance from IOC container and start installation
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
