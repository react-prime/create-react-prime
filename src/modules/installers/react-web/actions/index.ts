import fs from 'fs/promises';
import { state } from '@crp';

import { installApiHelper } from '../../shared/actions';
import { installComponent } from './installComponent';
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
  for await (const component of state.answers.components || []) {
    await installComponent(component);
  }

  createComponentsIndexFile();
}

export function createComponentsIndexFile(): void {
  const { projectName } = state.answers;

  if (!state.answers.components || !state.answers.components.length) {
    return;
  }

  const componentsByFolder = state.answers.components.reduce(
    (acc, component) => {
      const [folder, componentWithoutFolder] = component.split('/');

      if (!acc[folder]) {
        acc[folder] = [];
      }

      acc[folder].push(`export * from './${componentWithoutFolder}';`);
      return acc;
    },
    {} as { [folder: string]: string[] },
  );

  Object.entries(componentsByFolder).forEach(([folder, components]) => {
    const indexFile = `${projectName}/src/components/common/${folder}/index.ts`;
    fs.writeFile(indexFile, components.join('\n'));
  });
}
