import * as i from 'types';
import fs from 'fs';
import path from 'path';

import Util from 'core/Util';

import { getGeneratedFolder } from './generatedFolder';

// Path can stay as is — scripts are not involved in production env
const FILE = path.resolve('core/generated/build.json');

function prettyStringify(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}

function generateJSONType(): void {
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

export function addToJSON(key: string, value: i.JsonValues): void {
  getGeneratedFolder();

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, prettyStringify({ [key]: value }));
  } else {
    const util = new Util();
    const json = util.parseJSONFile(FILE);

    if (json != null) {
      json[key] = value;

      fs.writeFileSync(FILE, prettyStringify(json));
    }
  }

  generateJSONType();
}
