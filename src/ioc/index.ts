import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import commander from 'commander';
import App from '../App';
import initCLI from '../CLI';
import CLIMgr from '../CLIMgr';
import Logger from '../Logger';
import ClientInstaller from '../installers/Client';
import SsrInstaller from '../installers/Ssr';
import NativeInstaller from '../installers/Native';
import InstallStepList from '../InstallStepList';
import * as i from './types';
import SERVICES from './services';

export * from './types';

const container = new Container();
const { lazyInject } = getDecorators(container);

async function initContainer(): Promise<Container> {
  const CLI = await initCLI();

  container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
  container.bind<i.AppType>(SERVICES.App).to(App);
  container.bind<commander.Command>(SERVICES.CLI).toConstantValue(CLI);
  container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
  container.bind<i.InstallStepListType>(SERVICES.InstallStepList).to(InstallStepList);
  container.bind<i.InstallerType>(SERVICES.Installer.client).to(ClientInstaller);
  container.bind<i.InstallerType>(SERVICES.Installer.ssr).to(SsrInstaller);
  container.bind<i.InstallerType>(SERVICES.Installer.native).to(NativeInstaller);

  return container;
}

export { lazyInject, initContainer };
export default container;
