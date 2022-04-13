import fs from 'fs/promises';
import { state } from '@crp';

export function createComponentsIndexFile(): void {
  const { projectName } = state.answers;

  if (!state.answers.components || !state.answers.components.length) {
    return;
  }

  const componentsByFolder = {} as { [folder: string]: string[] };
  for (const component of state.answers.components) {
    const [folder, nameWithoutFolder] = component.split('/');

    if (!componentsByFolder[folder]) {
      componentsByFolder[folder] = [];
    }

    componentsByFolder[folder].push(`export * from './${nameWithoutFolder}';`);
  }

  for (const [folder, components] of Object.entries(componentsByFolder)) {
    const indexFile = `${projectName}/src/components/common/${folder}/index.ts`;
    fs.writeFile(indexFile, components.join('\n') + '\n');
  }
}
