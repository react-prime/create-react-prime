import 'reflect-metadata';
import { initContainer, AppType } from './ioc';
import SERVICES from './ioc/services';

// Get app from IOC container and start installation
initContainer().then((container) => {
  container
    .get<AppType>(SERVICES.App)
    .start();
});
