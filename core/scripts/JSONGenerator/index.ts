import * as i from 'types';
import path from 'path';
import fs from 'fs';
import type { JsonObject } from 'type-fest';
import lowdb, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import Util from 'core/Util';

import { getGeneratedFolder } from '../utils/generatedFolder';
import { generateModulesArray } from './modulesArray.scripts';


const BUILD_FILE_PATH = path.resolve('core/generated/build.json');

class JSONGenerator {
  private scripts: (() => JsonObject | undefined)[] = [
    generateModulesArray,
  ];
  // CRP Build JSON file
  private readonly buildDB: LowdbSync<i.BuildJSON> = lowdb((() => {
    getGeneratedFolder();
    return new FileSync(BUILD_FILE_PATH);
  })(),
  );


  constructor() {
    this.buildDB.defaults({}).write();
  }


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

  private addToJSON = (obj: JsonObject): void => {
    for (const key in obj) {
      this.buildDB
        .set(key, obj[key])
        .write();
    }
  }

  private generateJSONType = (): void => {
    const util = new Util();
    const json = util.parseJSONFile(BUILD_FILE_PATH);

    /* eslint-disable quotes */
    if (json != null) {
      let typeStr = "import type { JsonObject, ReadonlyDeep } from 'type-fest';\n\n";
      typeStr += 'export type BuildJSON = JsonObject & ReadonlyDeep<{';

      for (const key in json) {
        const t = typeof json[key];

        if (['string', 'number', 'boolean'].includes(t)) {
          typeStr += `\n  ${key}: ${t};`;
        }

        if (Array.isArray(json[key])) {
          typeStr += `\n  ${key}: string[];`;
        }
      }

      typeStr += '\n}>\n';
      /* eslint-enable */

      fs.writeFileSync('core/generated/types.ts', typeStr);
    }
  }
}

export const jsonGenerator = new JSONGenerator();
