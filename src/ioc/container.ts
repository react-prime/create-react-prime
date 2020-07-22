import * as i from 'types';
import { Container } from 'inversify';
import commander from 'commander';
import SERVICES from 'ioc/services';
import { installationConfig } from 'installers/config';
import InstallStepList from 'src/InstallStepList';
import App from 'src/App';
import initCli from 'src/CLI';
import CLIMgr from 'src/CLIMgr';
import Logger from 'utils/Logger';
import PackageMgr from 'utils/PackageMgr';
import PostQuestions from 'prompt/PostQuestions';
import PreQuestions from 'prompt/PreQuestions';


const container = new Container();

container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.AppType>(SERVICES.App).to(App);
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(initCli());
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
container.bind<i.PackageMgrType>(SERVICES.PackageMgr).to(PackageMgr);
container.bind<i.InstallStepListType>(SERVICES.InstallStepList).to(InstallStepList);
container.bind<i.QuestionsType>(SERVICES.Questions).to(PreQuestions).whenTargetNamed('pre');
container.bind<i.QuestionsType>(SERVICES.Questions).to(PostQuestions).whenTargetNamed('post');

for (const lang in installationConfig) {
  container.bind<i.StepsType>(SERVICES.Steps).to(installationConfig[lang].steps).whenTargetNamed(lang);

  for (const type in installationConfig[lang].type) {
    const { name, installer } = installationConfig[lang].type[type];

    container.bind<i.InstallerType>(SERVICES.Installer).to(installer).whenTargetNamed(name);
  }
}

export default container;
