import { db, updateSessionResult } from '@crp/db';

export async function closeApp(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  await updateSessionResult('success');
  await db.$disconnect();

  process.exit();
}
