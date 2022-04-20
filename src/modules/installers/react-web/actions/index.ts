import { existsSync } from 'fs';
import { state } from '@crp';

import { DOWNLOADED_MONOREPO_FOLDER_NAME } from 'src/modules/constants';
import {
  installApiHelper,
  installComponent,
  createComponentsIndexFile,
  downloadMonorepo,
} from '../../shared/actions';
import { installContinuousDeployScript } from './installContinuousDeployScript';
import { installDeployScript } from './installDeployScript';
import { installSentry } from './installSentry';

export async function installModules(): Promise<void> {
  for await (const module of state.answers.modules || []) {
    switch (module) {
      case 'api-helper':
        await installApiHelper();
        break;
      case 'manual-deploy':
        await installDeployScript();
        break;
      case 'continuous-deploy':
        await installContinuousDeployScript();
        break;
      case 'sentry':
        await installSentry();
        break;
    }
  }
}

export async function installComponents(): Promise<void> {
  if (!existsSync(DOWNLOADED_MONOREPO_FOLDER_NAME)) {
    await downloadMonorepo();
  }

  for await (const component of state.answers.components || []) {
    await installComponent(component, 'web');
  }

  createComponentsIndexFile();
}
