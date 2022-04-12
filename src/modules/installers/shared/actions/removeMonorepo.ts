import { asyncExec } from '@crp';

export async function removeMonorepo(): Promise<void> {
  await asyncExec('rm -rf ./prime-monorepo');
}
