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
import DefaultPrompt from 'modules/prompt/default/Prompt';


const container = new Container();

container.bind<i.LoggerType>(SERVICES.Logger).to(Logger);
container.bind<i.AppType>(SERVICES.App).to(App);
container.bind<commander.Command>(SERVICES.CLI).toConstantValue(initCli());
container.bind<i.CLIMgrType>(SERVICES.CLIMgr).to(CLIMgr).inSingletonScope();
container.bind<i.PackageMgrType>(SERVICES.PackageMgr).to(PackageMgr);
container.bind<i.PromptType>(SERVICES.Prompt).to(DefaultPrompt).whenTargetNamed('prompt_default');

for (const lang in installersConfig) {
  const langCfg = installersConfig[lang];

  container.bind<i.StepsType>(SERVICES.Steps).to(langCfg.steps).whenTargetNamed(lang);

  if (langCfg.prompt) {
    container.bind<i.PromptType>(SERVICES.Prompt).to(langCfg.prompt).whenTargetNamed(`prompt_${lang}`);
  }

  for (const type in langCfg.type) {
    const langTypeCfg = langCfg.type[type];

    container.bind<i.InstallerType>(SERVICES.Installer).to(langTypeCfg.installer).whenTargetNamed(langTypeCfg.name);

    if (langTypeCfg.prompt) {
      container.bind<i.PromptType>(SERVICES.Prompt).to(langTypeCfg.prompt).whenTargetNamed(`prompt_${lang}_${type}`);
    }
  }
}

export default container;
