import path from 'path';

import { JSONGenerator } from './utils/jsonGenerator';
import { generateModulesArray } from './generateModulesArray';


export async function run(): Promise<void> {
  // CRP runtime JSON file
  const jsonGenerator = new JSONGenerator(
    path.resolve('lib/generated/crp.json'),
    [
      generateModulesArray,
    ],
  );

  await jsonGenerator.build();
}
