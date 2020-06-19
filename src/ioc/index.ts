import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import commander from 'commander';
import App from '../App';
import cli from '../CLI';
import CLIMgr from '../CLIMgr';
import Logger from '../Logger';
import ClientInstaller from '../installers/Client';
import SsrInstaller from '../installers/Ssr';
import NativeInstaller from '../installers/Native';
import * as i from './types';
import SERVICES from './services';

const container = new Container();
container.bind<i.AppType>(SERVICES.App).to(App);
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(cli);
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.InstallerType>(SERVICES.Installer.client).to(ClientInstaller);
container.bind<i.InstallerType>(SERVICES.Installer.ssr).to(SsrInstaller);
container.bind<i.InstallerType>(SERVICES.Installer.native).to(NativeInstaller);

const { lazyInject } = getDecorators(container);

export * from './types';
export { lazyInject };
export default container;
