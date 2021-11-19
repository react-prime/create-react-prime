import * as i from 'types';
import path from 'path';
import fs from 'fs';

import Util from 'core/Util';

import { getGeneratedFolder } from '../utils/generatedFolder';
import { generateModulesArray } from './modulesArray.scripts';


const FILE = path.resolve('core/generated/build.json');

class JSONGenerator {
  private scripts: (() => i.Json | undefined)[] = [
    generateModulesArray,
  ];


  build = (): void => {
    getGeneratedFolder();

    for (const fn of this.scripts) {
      const val = fn();

      if (val) {
        this.addToJSON(val);
      }
    }

    this.generateJSONType();
  }

  private prettyStringify = (value: Record<string, unknown>): string => {
    return JSON.stringify(value, null, 2);
  }

  private addToJSON = (obj: i.Json): void => {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, this.prettyStringify(obj));
    } else {
      const util = new Util();
      const json = util.parseJSONFile(FILE);

      if (json != null) {
        for (const key in obj) {
          json[key] = obj[key];
        }

        fs.writeFileSync(FILE, this.prettyStringify(json));
      }
    }
  }

  private generateJSONType = (): void => {
    const util = new Util();
    const json = util.parseJSONFile(FILE);

    /* eslint-disable quotes */
    if (json != null) {
      let typeStr = "import * as i from 'types';\n\n";
      typeStr += 'export interface BuildJSON extends i.Json {';

      for (const key in json) {
        const t = typeof json[key];

        if (['string', 'number', 'boolean'].includes(t)) {
          typeStr += `\n  ${key}: ${t};`;
        }

        if (Array.isArray(json[key])) {
          typeStr += `\n  ${key}: string[];`;
        }
      }

      typeStr += '\n}\n';
      /* eslint-enable */

      fs.writeFileSync('core/generated/types.ts', typeStr);
    }
  }
}

export const jsonGenerator = new JSONGenerator();
