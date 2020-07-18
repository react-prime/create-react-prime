import path from 'path';
import fs from 'fs';
import util from 'util';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import SERVICES from 'ioc/services';


// Wrap utils in promise
const writeFile = util.promisify(fs.writeFile);


@injectable()
export default class PackageMgr implements i.PackageMgrType {
  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) private readonly logger: i.LoggerType,
  ) {}


  /**
   * Returns the package.json as JS object and its directory path
   */
  get package(): i.GetProjectPackage {
    const projectPkgPath = path.resolve(`${this.cliMgr.projectName}/package.json`);
    const pkgStr = fs.readFileSync(projectPkgPath, 'utf-8');

    if (!pkgStr) {
      this.logger.error(`No package.json found in ${path.resolve(this.cliMgr.projectName!)}`);
    }

    return {
      path: projectPkgPath,
      // Create new object instead of a reference
      json: JSON.parse(pkgStr),
    };
  }

  /**
   * Async overwrite project's package.json
   * @param npmPkg package.json as JS object
   */
  async write(npmPkg: i.PackageJson): Promise<void> {
    const { path } = this.package;

    await writeFile(path, JSON.stringify(npmPkg, null, 2));
  }

  /**
   * Updates node package variables
   * @param npmPkg package.json as JS object
   */
  async update(npmPkg?: i.PackageJson): Promise<void> {
    const { projectName } = this.cliMgr;
    const pkg = npmPkg || this.package.json;

    // Overwrite boilerplate defaults
    pkg.name = projectName;
    pkg.version = '0.1.0';
    pkg.description = `Repository of ${projectName}.`;
    pkg.author = 'Label A [labela.nl]';
    pkg.keywords = [];
    pkg.repository = { url: '' };

    await this.write(pkg);
  }
}
