import { prepareContainer, AppType } from './ioc/container';
import SERVICES from './ioc/services';

// Get app from IOC container and start installation
prepareContainer().then((container) => {
  const app = container.get<AppType>(SERVICES.App);
  app.start();
});
