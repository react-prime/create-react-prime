import App from '../App';
import Installer from './Installer';

export default class NativeInstaller extends Installer {
  constructor() {
    super();

    App.setProjectName(
      App.getInstallConfig().projectName.replace(/\W/g, ''),
    );
  }

  protected async updatePackage() {
    const { projectName } = App.getInstallConfig();
    const pkg = App.getProjectNpmPackage().json;

    pkg.scripts = pkg.scripts || {};
    pkg.scripts.renameNative = `npx react-native-rename ${projectName}`;
    pkg.scripts.replaceWithinFiles = `npx replace 'reactprimenative' '${projectName}' . -r --exclude="package*.json"`;
    pkg.scripts.replaceSchemeFilenames = `npx renamer -d --find "/reactprimenative/g" --replace "${projectName}" "**"`;

    super.updatePackage(pkg);
  }
}
