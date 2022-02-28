import path from 'path';
import fs from 'fs';
import type { JsonObject } from 'type-fest';
import { Low, JSONFile } from 'lowdb';

import { generateModulesArray } from '../generateModulesArray';
import { getGeneratedFolder } from './generatedFolder';
import { logger } from '@crp';


// CRP Build JSON file
const BUILD_FILE_PATH = path.resolve('lib/generated/build.json');


export class JSONGenerator {
  private scripts: (() => JsonObject | undefined)[] = [
    generateModulesArray,
  ];
  readonly buildDB!: Low<JsonObject>;


  constructor(
    private path: string,
  ) {
    this.buildDB = new Low(new JSONFile(path));
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

    const typeStr = this.generateJSONType();

    if (typeStr) {
      fs.writeFileSync('lib/generated/types.ts', typeStr);
    } else {
      logger.warning(`Something went wrong generating types for '${this.path}'`);
    }
  };

  addToJSON = async (obj: JsonObject): Promise<void> => {
    for (const key in obj) {
      this.buildDB.data![key] = obj[key];
    }

    await this.buildDB.write();
  };

  generateJSONType = (): string | undefined => {
    const json: JsonObject | void = (() => {
      const raw = fs.readFileSync(this.path, 'utf8');

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

      return typeStr;
    }
  };
}

export const jsonGenerator = new JSONGenerator(BUILD_FILE_PATH);
