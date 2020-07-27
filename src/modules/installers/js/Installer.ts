import * as i from 'types';
import { injectable, inject } from 'inversify';

import Installer from 'core/Installer';
import SERVICES from 'core/ioc/services';

import STEPS from 'modules/steps/identifiers';


@injectable()
export default class JsInstaller extends Installer implements i.InstallerType {
  @inject(SERVICES.PackageMgr) protected readonly packageMgr!: i.PackageMgrType;

  async useStepMethod(step: i.InstallStepIds) {
    // Updates node package variables
    if (step === STEPS.UpdatePackage) {
      await this.packageMgr.update();
    }
  }
}
