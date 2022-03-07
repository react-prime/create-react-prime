import { db, updateOperationResult } from '@crp/db';

export async function closeApp(): Promise<void> {
  await updateOperationResult('success');
  await db.$disconnect();

  process.exit();
}
