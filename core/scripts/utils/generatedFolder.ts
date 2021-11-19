import fs from 'fs';
import path from 'path';


export function getGeneratedFolder(): string {
  const PATH = path.resolve('core/generated');

  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
  }

  return PATH;
}
