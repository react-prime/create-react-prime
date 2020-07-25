const STEPS = {
  Clone: 'clone',
  UpdatePackage: 'updatePackage',
  NpmInstall: 'npmInstall',
  Cleanup: 'cleanup',
  RunNativeScripts: 'runNativeScripts',
} as const;

export default STEPS;
