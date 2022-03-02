import { state } from '@crp';
import { db } from '@crp/db';


export async function closeApp(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  await db.session.update({
    where: {
      id: state.session.id,
    },
    data: {
      success: true,
    },
  });

  await db.$disconnect();

  process.exit();
}
