import cp from 'child_process';
import util from 'util';

export const asyncExec = util.promisify(cp.exec);
