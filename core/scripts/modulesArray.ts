import fs from 'fs';
import path from 'path';

import { addToJSON } from './addToJSON';


// Extract the names of all installable boilerplates from their folder name
export async function generateModulesArray(): Promise<string[]> {
  const arr = fs.readdirSync(path.resolve('modules'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name.toLowerCase() !== 'defaults');

  await addToJSON('modules', arr);

  return arr;
}
