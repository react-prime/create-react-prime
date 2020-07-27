import * as i from 'types';

class GetIocTargetName {
  prompt(lang?: i.InstallLangs, type?: i.InstallTypes) {
    return this.factory('prompt', lang, type);
  }

  steps(lang: i.InstallLangs, type?: i.InstallTypes) {
    return this.factory('steps', lang, type);
  }

  private factory(target: 'prompt' | 'steps', lang?: i.InstallLangs, type?: i.InstallTypes): string {
    if (!lang) {
      return `${target}_default`;
    }

    let str = `${target}_${lang}`;

    if (type) {
      str += `_${type}`;
    }

    return str;
  }
}

const getIocTargetName = new GetIocTargetName();

export default getIocTargetName;
