import 'reflect-metadata';
import * as i from 'types';
import { Container } from 'inversify';
import commander from 'commander';
import SERVICES from 'ioc/services';
import ClientInstaller from 'installers/Client';
import SsrInstaller from 'installers/Ssr';
import NativeInstaller from 'installers/Native';
import InstallStepList from 'src/InstallStepList';
import App from 'src/App';
import InitCli from 'src/CLI';
import CLIMgr from 'src/CLIMgr';
import Logger from 'utils/Logger';
import PackageMgr from 'src/utils/PackageMgr';

const container = new Container();

container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.AppType>(SERVICES.App).to(App);
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(InitCli());
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
container.bind<i.PackageMgrType>(SERVICES.PackageMgr).to(PackageMgr);
container.bind<i.InstallStepListType>(SERVICES.InstallStepList).to(InstallStepList);
container.bind<i.InstallerType>(SERVICES.Installer).to(ClientInstaller).whenTargetNamed('client');
container.bind<i.InstallerType>(SERVICES.Installer).to(SsrInstaller).whenTargetNamed('ssr');
container.bind<i.InstallerType>(SERVICES.Installer).to(NativeInstaller).whenTargetNamed('native');

export default container;
