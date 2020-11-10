import * as i from 'types';

class GetIocTargetName {
  prompt(lang?: i.InstallLangs, boilerplate?: i.BoilerplateTypes) {
    return this.factory('prompt', lang, boilerplate);
  }

  steps(lang: i.InstallLangs, boilerplate?: i.BoilerplateTypes) {
    return this.factory('steps', lang, boilerplate);
  }

  private factory(target: 'prompt' | 'steps', lang?: i.InstallLangs, boilerplate?: i.BoilerplateTypes): string {
    if (!lang) {
      return `${target}_default`;
    }

    let str = `${target}_${lang}`;

    if (boilerplate) {
      str += `_${boilerplate}`;
    }

    return str;
  }
}

const getIocTargetName = new GetIocTargetName();

export default getIocTargetName;
