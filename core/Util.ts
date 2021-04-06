import util from 'util';
import fs from 'fs';
import cp from 'child_process';


class Util {
  asyncExec = util.promisify(cp.exec);
  asyncWriteFile = util.promisify(fs.writeFile);
}

export default Util;
