import * as i from 'types';
import path from 'path';
import Util from './Util';


class ScriptsMgr {
  json(): i.BuildJSON {
    const util = new Util();

    // Need __dirname to resolve CRP dist path
    // or else it will resolve with the dir path from where the user runs CRP
    const p = path.resolve(__dirname, 'build.json');
    return util.parseJSONFile<i.BuildJSON>(p)!;
  }
}

const scriptsMgr = new ScriptsMgr();

export default scriptsMgr;
