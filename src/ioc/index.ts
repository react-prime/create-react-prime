import { Container } from 'inversify';
import commander from 'commander';
import App from '../App';
import cli from '../CLI';
import CLIMgr from '../CLIMgr';
import Logger from '../Logger';
import ClientInstaller from '../installers/Client';
import SsrInstaller from '../installers/Ssr';
import * as i from './types';
import SERVICES from './services';

const container = new Container();
container.bind<i.AppType>(SERVICES.App).to(App).inSingletonScope();
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(cli);
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr);
container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.InstallerType>(SERVICES.Installer.client).to(ClientInstaller);
container.bind<i.InstallerType>(SERVICES.Installer.ssr).to(SsrInstaller);

export * from './types';
export default container;
