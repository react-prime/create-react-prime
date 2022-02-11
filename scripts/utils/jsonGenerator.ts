// @ts-check
import type * as i from 'types';
import path from 'path';
import fs from 'fs';
import type { JsonObject } from 'type-fest';
import type { LowdbSync } from 'lowdb';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { getGeneratedFolder } from '../utils/generatedFolder';
import { generateModulesArray } from '../generateModulesArray';


const BUILD_FILE_PATH = path.resolve('modules_v3/lib/generated/build.json');

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
  };

  private addToJSON = (obj: JsonObject): void => {
    for (const key in obj) {
      this.buildDB
        .set(key, obj[key])
        .write();
    }
  };

  private generateJSONType = (): void => {
    const json: JsonObject | void = (() => {
      const raw = fs.readFileSync(BUILD_FILE_PATH, 'utf8');

      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as JsonObject;
      const copy = { ...parsed };

      return copy;
    })();

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

      typeStr += '\n}>;\n';
      /* eslint-enable */

      fs.writeFileSync('modules_v3/lib/generated/types.ts', typeStr);
    }
  };
}

export const jsonGenerator = new JSONGenerator();
