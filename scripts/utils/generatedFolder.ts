import fs from 'fs';
import path from 'path';


export function getGeneratedFolder(): string {
  const PATH = path.resolve('modules_v3/lib/generated');

  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
  }

  return PATH;
}
