/**
 * Transform env variables to strings
 */

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const rootPath = 'dist';

const files = [
  'CLI.js',
  'main.js'
];

for (const file of files) {
  const src = path.resolve(rootPath, file);
  const dest = src.replace('.js', '_cp.js');

  fs.copyFileSync(src, dest);
  fs.unlinkSync(src);

  cp.execSync(`npx loose-envify ${dest} > ${src}`);

  fs.unlinkSync(dest);
}
