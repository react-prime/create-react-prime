import fs from 'fs';
import path from 'path';


// Extract the names of all installable boilerplates from their folder name
export function generateModulesArray(): Record<'modules', string[]> {
  const arr = fs.readdirSync(path.resolve('modules'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name.toLowerCase() !== 'defaults');

  return {
    modules: arr,
  };
}
