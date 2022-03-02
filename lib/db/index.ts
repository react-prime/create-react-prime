import prisma from '@prisma/client';
import { cli, state } from '@crp';
const { PrismaClient } = prisma;


export const db = (() => {
  if (process.env.NODE_ENV === 'test') {
    return {} as prisma.PrismaClient;
  }

  return new PrismaClient();
})();

// Disconnect from DB when process exits
process.on('exit', () => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  db.$disconnect();
  process.exit();
});


export async function logAction(name: string, value?: unknown, data?: ActionData): Promise<unknown> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  return db.action.create({
    data: {
      name,
      value: JSON.stringify(value),
      success: data?.success ?? false,
      session: {
        connect: {
          id: state.session.id,
        },
      },
    },
  })
    .catch((err) => {
      if (cli.opts().debug) {
        console.error(err);
      }
    });
}

type ActionData = {
  success?: boolean;
  error?: string;
};
