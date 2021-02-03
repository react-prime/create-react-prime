const path =require('path');
const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

tsConfigPaths.register({
  baseUrl: path.resolve('dist'),
  paths: tsConfig.compilerOptions.paths,
});
