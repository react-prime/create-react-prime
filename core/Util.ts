import util from 'util';
import cp from 'child_process';


class Util {
  asyncExec = util.promisify(cp.exec);
}

export default Util;
