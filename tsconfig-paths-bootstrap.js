const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

tsConfigPaths.register({
  baseUrl: './dist/',
  paths: tsConfig.compilerOptions.paths,
});
