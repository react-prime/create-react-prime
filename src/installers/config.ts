import Installer from 'installers/Installer';
import NativeInstaller from 'installers/Native';

/** Github organization tag */
export const ORGANIZATION = 'react-prime';

export const installerCfg = [
  {
    name: 'client',
    repository: 'react-prime',
    description: 'Client-side rendering',
    installer: Installer,
  },
  {
    name: 'ssr',
    repository: 'react-prime-ssr',
    description: 'Server-side rendering',
    installer: Installer,
  },
  {
    name: 'native',
    repository: 'react-prime-native',
    description: 'React-native w/o Expo',
    installer: NativeInstaller,
  },
] as const;
