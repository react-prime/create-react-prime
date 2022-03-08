import { updateOperationResult } from '@crp/db';

export async function closeApp(): Promise<void> {
  await updateOperationResult({ result: 'success' });

  process.exit();
}
