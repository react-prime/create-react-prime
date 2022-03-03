import type * as i from 'types';
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
process.on('exit', async () => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (state.session.result === 'pending') {
    await updateSessionResult('exited');
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
        connectOrCreate: {
          where: {
            id: state.session.id || '',
          },
          create: {},
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

export async function updateSessionResult(
  result: i.SessionResult,
  data?: Record<string, unknown>,
): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  state.session.result = result;

  db.session.update({
    where: {
      id: state.session.id,
    },
    data: {
      result,
      ...data,
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
