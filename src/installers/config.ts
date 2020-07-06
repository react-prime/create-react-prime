import Installer from 'installers/Installer';
import NativeInstaller from 'installers/Native';

/** Github organization tag */
export const ORGANIZATION = 'react-prime';

export const installerCfg = [
  {
    name: 'client',
    repository: 'react-prime',
    installer: Installer,
  },
  {
    name: 'ssr',
    repository: 'react-prime-ssr',
    installer: Installer,
  },
  {
    name: 'native',
    repository: 'react-prime-native',
    installer: NativeInstaller,
  },
];
