import * as i from 'types';
import fs from 'fs';
import path from 'path';

import Util from 'core/Util';

import { getGeneratedFolder } from './generatedFolder';


const PATH = path.resolve('core/generated/build.json');

function prettyStringify(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}

function generateJSONType(): void {
  const util = new Util();
  const json = util.parseJSONFile(PATH);

  if (json != null) {
    let typeStr = 'export interface BuildJSON {';

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

    fs.writeFileSync('core/generated/types.ts', typeStr);
  }
}

export function addToJSON(key: string, value: i.JsonValues): void {
  getGeneratedFolder();

  if (!fs.existsSync(PATH)) {
    fs.writeFileSync(PATH, prettyStringify({ [key]: value }));
  } else {
    const util = new Util();
    const json = util.parseJSONFile(PATH);

    if (json != null) {
      json[key] = value;

      fs.writeFileSync(PATH, prettyStringify(json));
    }
  }

  generateJSONType();
}
