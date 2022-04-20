import fs from 'fs/promises';
import path from 'path';
import type { PackageJson } from 'type-fest';
import { logger } from '@crp';
import { ERROR_TEXT } from '@crp/constants';

// Helper to get path to the project's package.json + JS object of its content
export async function getPackageJson(
  pkgFile: string,
): Promise<never | { path: string; json: PackageJson }> {
  const projectPkgPath = path.resolve(pkgFile);
  const pkgStr = await (async () => {
    // Silently fail if package.json doesn't exist
    try {
      const raw = await fs.readFile(projectPkgPath, 'utf8');
      const parsed = JSON.parse(raw) as PackageJson;
      const copy = { ...parsed };

      return copy;
    } catch (err) {}
  })();

  if (!pkgStr) {
    await logger.error(ERROR_TEXT.PkgNotFound, projectPkgPath);
  }

  return {
    path: projectPkgPath,
    json: pkgStr!,
  };
}
