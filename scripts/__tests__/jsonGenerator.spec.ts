import fs from 'fs';
import { spyOn } from 'vitest';
import tempy from 'tempy';

import { JSONGenerator } from 'scripts/utils/jsonGenerator';


describe('jsonGenerator', () => {
  let jsonGenerator: JSONGenerator;

  beforeEach(() => {
    jsonGenerator = new JSONGenerator(tempy.file());
  });

  it('Starts with an empty JSON file', () => {
    expect(jsonGenerator.buildDB.data).toEqual({});
  });

  it('Generates a valid JSON file', async () => {
    await jsonGenerator.addToJSON({ modules: ['test'] });

    expect(jsonGenerator.buildDB.data).toEqual({ modules: ['test'] });
  });

  it('Generates a valid type from JSON file', async () => {
    spyOn(fs, 'readFileSync').mockImplementationOnce(() => JSON.stringify({ modules: ['test'] }));

    await jsonGenerator.addToJSON({ modules: ['test'] });
    const typeStr = jsonGenerator.generateJSONType();

    // eslint-disable-next-line quotes
    let str = "import type { JsonObject, ReadonlyDeep } from 'type-fest';\n\n";
    str += 'export type BuildJSON = JsonObject & ReadonlyDeep<{';
    str += '\n  modules: string[];';
    str += '\n}>;\n';

    expect(typeStr).toEqual(str);
  });
});
