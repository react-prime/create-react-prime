import { injectable } from 'inversify';
import Installer from './Installer';

@injectable()
export default class NativeInstaller extends Installer {
  constructor() {
    super();
  }

  init(): void {
    super.init();

    // Native project names can only contain alphanumerical characters
    this.cliMgr.projectName = this.cliMgr.projectName.replace(/\W/g, '');
  }
}
