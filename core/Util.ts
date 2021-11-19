import * as i from 'types';
import util from 'util';
import fs from 'fs';
import cp from 'child_process';


export default class Util {
  asyncExec = util.promisify(cp.exec);
  asyncWriteFile = util.promisify(fs.writeFile);

  parseJSONFile = <R extends i.Json = i.Json>(path: string): R | undefined => {
    const raw = fs.readFileSync(path, { encoding: 'utf8' });

    if (raw) {
      const parsed = JSON.parse(raw) as R;
      const copy = { ...parsed };

      return copy;
    }
  }
}
