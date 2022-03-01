import fs from 'fs';
import { type SpyInstanceFn, spyOn } from 'vitest';
import tempy from 'tempy';

import { JSONGenerator } from '../utils/jsonGenerator';


describe('jsonGenerator', () => {
  let scriptFn: SpyInstanceFn<[], { foo: string }>;
  let jsonGenerator: JSONGenerator;

  beforeEach(() => {
    scriptFn = vi.fn(() => ({ foo: 'bar' }));
    jsonGenerator = new JSONGenerator(tempy.file(), [scriptFn]);
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

  it('Generates the JSON file and type', async () => {
    vi.mock('./generatedFolder', () => tempy);
    const genTypeSpy = spyOn(jsonGenerator, 'generateJSONType');
    const genJSONSpy = spyOn(jsonGenerator, 'addToJSON');
    const writeFileSpy = spyOn(fs, 'writeFileSync').mockImplementationOnce(() => void {});

    await jsonGenerator.build();

    expect(scriptFn).toHaveBeenCalled();
    expect(jsonGenerator.buildDB.data).toEqual({ foo: 'bar' });
    expect(genJSONSpy).toHaveBeenCalled();
    expect(genTypeSpy).toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalled();
  });

  it('Throws an error if the JSON file is invalid', async () => {
    vi.mock('./generatedFolder', () => tempy);
    const genTypeSpy = spyOn(jsonGenerator, 'generateJSONType');
    const genJSONSpy = spyOn(jsonGenerator, 'addToJSON');
    // @ts-ignore
    const exitSpy = spyOn(process, 'exit').mockImplementationOnce(() => void {});
    const errorLogSpy = spyOn(console, 'error').mockImplementationOnce(() => void {});

    // @ts-expect-error
    spyOn(fs, 'readFileSync').mockImplementationOnce(() => undefined);

    await jsonGenerator.build();

    expect(scriptFn).toHaveBeenCalled();
    expect(jsonGenerator.buildDB.data).toEqual({ foo: 'bar' });
    expect(genJSONSpy).toHaveBeenCalled();
    expect(genTypeSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalled();
    expect(errorLogSpy).toHaveBeenCalled();
  });
});
