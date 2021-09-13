import Installer from 'core/decorators/Installer';
import cliMgr from 'core/CLIMgr';
import Util from 'core/Util';


@Installer({
  name: 'gatsby',
  cloneUrl: 'https://github.com/react-prime/react-prime-gatsby.git',
})
export default class GatsbyInstaller {
  async afterInstall(): Promise<void> {
    const projectName = cliMgr.getProjectName();
    const prefixPath = `${projectName}/.env`;
    const key = 'GATSBY_SITE_URL';

    const util = new Util();

    await util.asyncExec(`touch ${prefixPath}.production`);
    await util.asyncExec(`touch ${prefixPath}.development`);

    await util.asyncWriteFile(`${prefixPath}.production`, `${key}=`);
    await util.asyncWriteFile(`${prefixPath}.development`, `${key}=http://localhost:3000`);
  }
}
