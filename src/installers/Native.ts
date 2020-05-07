import App from '../App';
import Installer from './Installer';

export default class NativeInstaller extends Installer {
  constructor() {
    super();

    App.setProjectName(
      App.getProjectName().replace(/\W/g, ''),
    );
  }
}
