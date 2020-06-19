const SERVICES = {
  App: Symbol('app'),
  CLI: Symbol('cli'),
  CLIMgr: Symbol('cliMgr'),
  Logger: Symbol('logger'),
  Installer: {
    client: Symbol('client'),
    ssr: Symbol('ssr'),
    native: Symbol('native'),
  },
};

export default SERVICES;
