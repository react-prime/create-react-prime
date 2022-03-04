import { db, updateOperationResult } from '@crp/db';

export async function closeApp(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  await updateOperationResult('success');
  await db.$disconnect();

  process.exit();
}
