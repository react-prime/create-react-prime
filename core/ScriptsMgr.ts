import * as i from 'types';
import path from 'path';
import Util from './Util';


class ScriptsMgr {
  private readonly PATH = path.resolve('core/generated');

  json(): i.BuildJSON {
    const util = new Util();

    const p = path.resolve(this.PATH, 'build.json');
    return util.parseJSONFile(p)! as unknown as i.BuildJSON;
  }
}

const scriptsMgr = new ScriptsMgr();

export default scriptsMgr;
