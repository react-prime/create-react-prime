import { state } from '@crp';

import { installApiHelper } from '../../shared/actions';
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
