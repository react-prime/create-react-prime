import * as i from 'types';
import path from 'path';
import { readFileSync } from 'fs';

import Util from 'core/Util';
import { ERROR_TEXT } from 'core/constants';
import Step from 'core/decorators/Step';
import cliMgr from 'core/CLIMgr';
import Logger from 'core/Logger';


@Step({
  name: 'update-package',
  spinner: {
    emoji: '✏️ ',
    message: {
      pending: () => 'Updating package.json...',
      success: () => 'Updated package.json!',
    },
  },
})
export class NpmPackageUpdateStep {
  async on(): Promise<void> {
    const pkg = this.getNPMPackage().json;

    // Overwrite boilerplate defaults
    pkg.name = cliMgr.getProjectName();
    pkg.version = '0.1.0';
    pkg.description = `Repository of ${cliMgr.getProjectName()}.`;
    pkg.author = 'Label A [labela.nl]';
    pkg.keywords = [];
    pkg.repository = { url: '' };

    await this.write(pkg);
  }


  private getNPMPackage() {
    const projectPkgPath = path.resolve(`${cliMgr.getProjectName()}/package.json`);
    const pkgStr = readFileSync(projectPkgPath, 'utf-8');

    if (!pkgStr) {
      const logger = new Logger();
      logger.error(ERROR_TEXT.PkgNotFound, path.resolve(cliMgr.getProjectName()));
    }

    return {
      path: projectPkgPath,
      // Create new object instead of a reference
      json: JSON.parse(pkgStr),
    };
  }

  private async write(npmPkg: PackageJson): Promise<void> {
    const util = new Util();
    const { path } = this.getNPMPackage();

    await util.asyncWriteFile(path, JSON.stringify(npmPkg, null, 2));
  }
}

export interface PackageJson {
  scripts?: Record<string, string>;
  repository?: {
    url: string;
    [key: string]: string;
  };
  [key: string]: i.Json | undefined;
}
