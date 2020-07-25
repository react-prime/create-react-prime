import * as i from 'types';

import Installer from 'core/Installer';


export default class JsInstaller extends Installer implements i.InstallerType {
  /** Updates node package variables */
  protected updatePackage(): void {
    this.packageMgr.update();
  }
}
