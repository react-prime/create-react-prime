import path from 'path';
import fs from 'fs';
import type { JsonObject } from 'type-fest';
import { Low, JSONFile } from 'lowdb';

import { generateModulesArray } from '../generateModulesArray';
import { getGeneratedFolder } from './generatedFolder';


const BUILD_FILE_PATH = path.resolve('lib/generated/build.json');

class JSONGenerator {
  private scripts: (() => JsonObject | undefined)[] = [
    generateModulesArray,
  ];
  // CRP Build JSON file
  private readonly buildDB: Low<JsonObject> = new Low(new JSONFile(BUILD_FILE_PATH));


  constructor() {
    this.buildDB.data ||= {};
  }


  build = async (): Promise<void> => {
    getGeneratedFolder();

    for await (const fn of this.scripts) {
      const val = fn();

      if (val) {
        await this.addToJSON(val);
      }
    }

    this.generateJSONType();
  };

  private addToJSON = async (obj: JsonObject): Promise<void> => {
    for (const key in obj) {
      this.buildDB.data![key] = obj[key];
    }

    await this.buildDB.write();
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

      fs.writeFileSync('lib/generated/types.ts', typeStr);
    }
  };
}

export const jsonGenerator = new JSONGenerator();
