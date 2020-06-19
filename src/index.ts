import 'reflect-metadata';
import container, { AppType } from './ioc';
import SERVICES from './ioc/services';

// Get app from IOC container and start installation
container
  .get<AppType>(SERVICES.App)
  .start();
