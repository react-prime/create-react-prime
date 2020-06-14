const INSTALL_STEP = {
  CLONE: Symbol.for('clone'),
  UPDATE_PACKAGE: Symbol.for('update'),
  NPM_INSTALL: Symbol.for('install'),
  CLEANUP: Symbol.for('cleanup'),
  RUN_NATIVE_SCRIPTS: Symbol.for('native_scripts'),
};

export default INSTALL_STEP;
