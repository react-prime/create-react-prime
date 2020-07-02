import * as i from 'types';
import container from 'ioc';
import SERVICES from 'ioc/services';

// Get app instance from IOC container and start installation
const app = container.get<i.AppType>(SERVICES.App);

app.start();
