import 'reflect-metadata';
import * as i from 'types';
import { Container } from 'inversify';
import commander from 'commander';
import SERVICES from 'ioc/services';
import InstallStepList from 'src/InstallStepList';
import App from 'src/App';
import initCli from 'src/CLI';
import CLIMgr from 'src/CLIMgr';
import Logger from 'utils/Logger';
import PackageMgr from 'src/utils/PackageMgr';
import { installerCfg } from 'installers/config';

const container = new Container();

container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.AppType>(SERVICES.App).to(App);
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(initCli());
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
container.bind<i.PackageMgrType>(SERVICES.PackageMgr).to(PackageMgr);
container.bind<i.InstallStepListType>(SERVICES.InstallStepList).to(InstallStepList);

for (const { name, installer } of installerCfg) {
  container.bind<i.InstallerType>(SERVICES.Installer).to(installer).whenTargetNamed(name);
}

export default container;
