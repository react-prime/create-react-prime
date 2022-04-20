import { state } from '@crp';

import {
  installApiHelper,
  installComponent,
  createComponentsIndexFile,
} from '../../shared/actions';
import { installUseAuthentication } from './installUseAuthentication';

export * from './podInstall';
export * from './renameFiles';
export * from './renameProject';
export * from './validateProjectName';

export async function installModules(): Promise<void> {
  for await (const module of state.answers.modules || []) {
    switch (module) {
      case 'api-helper':
        await installApiHelper();
        break;
      case 'use-authentication':
        await installUseAuthentication();
        break;
    }
  }
}

export async function installComponents(): Promise<void> {
  for await (const component of state.answers.components || []) {
    await installComponent(component, 'mobile');
  }

  createComponentsIndexFile();
}
