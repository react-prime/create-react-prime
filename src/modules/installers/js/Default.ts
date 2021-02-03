import * as i from '../../../core/types';
import { injectable, inject } from 'inversify';

import Installer from '../../../core/Installer';
import SERVICES from '../../../core/ioc/services';

import STEPS from '../../steps/identifiers';


@injectable()
export default class JsDefaultInstaller extends Installer {
  @inject(SERVICES.PackageMgr) protected readonly packageMgr!: i.PackageMgrType;

  async afterInstallStep(step: i.InstallStepIds) {
    // Updates node package variables
    if (step === STEPS.UpdatePackage) {
      await this.packageMgr.update();
    }
  }
}
