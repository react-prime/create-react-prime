import * as i from 'types';
import { injectable, inject } from 'inversify';

import Installer from 'core/Installer';
import SERVICES from 'core/ioc/services';


@injectable()
export default class JsInstaller extends Installer implements i.InstallerType {
  @inject(SERVICES.PackageMgr) protected readonly packageMgr!: i.PackageMgrType;

  /** Updates node package variables */
  protected updatePackage(): void {
    this.packageMgr.update();
  }
}
