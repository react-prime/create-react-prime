const INSTALL_STEP = {
  CLONE: Symbol(),
  UPDATE_PACKAGE: Symbol(),
  NPM_INSTALL: Symbol(),
  CLEANUP: Symbol(),
  RUN_NATIVE_SCRIPTS: Symbol(),
};

export default INSTALL_STEP;
