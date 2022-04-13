import fs from 'fs/promises';
import { state } from '@crp';

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
    fs.writeFile(indexFile, components.join('\n') + '\n');
  });
}
