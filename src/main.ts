import * as i from 'types';
import { prepareContainer } from 'ioc';
import SERVICES from 'ioc/services';

// Get app from IOC container and start installation
prepareContainer().then((container) => {
  const app = container.get<i.AppType>(SERVICES.App);
  app.start();
});
