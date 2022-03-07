import type * as i from 'types';
import prisma, { type Operation } from '@prisma/client';
import { cli, state, settings } from '@crp';
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

  db.$disconnect();
  process.exit();
});

export async function logAction(
  name: string,
  value?: unknown,
  data?: ActionData,
): Promise<unknown> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  return db.action
    .create({
      data: {
        name,
        value: JSON.stringify(value),
        success: data?.success ?? false,
        operation: {
          connectOrCreate: {
            where: {
              id: state.operation.id || '',
            },
            create: {
              username:
                (await settings.getSetting('trackingName')) || 'Anonymous',
            },
          },
        },
      },
    })
    .then((data) => {
      state.operation.id = data.operationId;
    })
    .catch((err) => {
      if (cli.opts().debug) {
        console.error(err);
      }
    });
}

export async function updateOperationResult(
  result: i.OperationResult,
  data?: Record<string, unknown>,
): Promise<Operation | void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  state.operation.result = result;

  return db.operation
    .update({
      where: {
        id: state.operation.id,
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
