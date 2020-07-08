import * as i from 'types';
import container from 'ioc';
import SERVICES from 'ioc/services';

async function main() {
  // Get app instance from IOC container and start installation
  const app = container.get<i.AppType>(SERVICES.App);

  // Run application
  await app.install();
  await app.form();

  // Exit Node process
  process.exit();
}

main();
