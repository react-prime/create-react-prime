import fs from 'fs';
import cp from 'child_process';
import util from 'util';

export const asyncExec = util.promisify(cp.exec);
export const asyncWrite = util.promisify(fs.writeFile);
export const asyncExists = util.promisify(fs.exists);
