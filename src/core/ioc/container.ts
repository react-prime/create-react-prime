import * as i from 'types';
import { Container } from 'inversify';
import commander from 'commander';

import SERVICES from 'core/ioc/services';
import App from 'core/App';
import initCli from 'core/CLI';
import CLIMgr from 'core/CLIMgr';
import Logger from 'core/utils/Logger';
import PackageMgr from 'core/utils/PackageMgr';

import installersConfig from 'modules/config';
import PostQuestions from 'modules/prompt/PostQuestions';
import PreQuestions from 'modules/prompt/PreQuestions';


const container = new Container();

container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.AppType>(SERVICES.App).to(App);
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(initCli());
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
container.bind<i.PackageMgrType>(SERVICES.PackageMgr).to(PackageMgr);
container.bind<i.QuestionsType>(SERVICES.Questions).to(PreQuestions).whenTargetNamed('pre');
container.bind<i.QuestionsType>(SERVICES.Questions).to(PostQuestions).whenTargetNamed('post');

for (const lang in installersConfig) {
  container.bind<i.StepsType>(SERVICES.Steps).to(installersConfig[lang].steps).whenTargetNamed(lang);

  for (const type in installersConfig[lang].type) {
    const { name, installer } = installersConfig[lang].type[type];

    container.bind<i.InstallerType>(SERVICES.Installer).to(installer).whenTargetNamed(name);
  }
}

export default container;
