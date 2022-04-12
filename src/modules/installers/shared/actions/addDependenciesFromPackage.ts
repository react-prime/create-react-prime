import type { PackageJson } from 'type-fest';
import { state, asyncExec } from '@crp';

// Helper to add dependencies to a package.json (without installing)
export async function addDependenciesFromPackage(
  pkg: PackageJson,
): Promise<void> {
  const { projectName } = state.answers;
  const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : null;

  if (dependencies && dependencies.length > 0) {
    await asyncExec(
      `npx add-dependencies ${projectName}/package.json ${dependencies.join(
        ' ',
      )}`,
    );
  }

  const devDependencies = pkg.devDependencies
    ? Object.keys(pkg.devDependencies)
    : null;

  if (devDependencies && devDependencies.length > 0) {
    await asyncExec(
      `npx add-dependencies ${projectName}/package.json ${devDependencies.join(
        ' ',
      )} -D`,
    );
  }
}
