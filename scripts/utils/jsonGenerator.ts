import fs from 'fs';
import type { JsonObject } from 'type-fest';
import { Low, JSONFile } from 'lowdb';

import { getGeneratedFolder } from './generatedFolder';


export class JSONGenerator {
  readonly buildDB!: Low<JsonObject>;

  constructor(
    private path: string,
    private scripts: (() => JsonObject | undefined)[],
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
      console.error(`Something went wrong generating types for '${this.path}'`);
      process.exit(1);
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
