import type * as i from 'types';
import { state, settings } from '@crp';
import got from 'got';

// @ts-ignore
const API_URL = __API__;

export async function createOperation(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    const username = await settings.getSetting('trackingName');

    const result = await got
      .post(`${API_URL}/operation`, {
        json: {
          username,
        },
      })
      .json<CreateOperationActionResult>();

    if (result.operationId) {
      state.operation.id = result.operationId;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function logAction(
  name: string,
  value?: unknown,
  data?: ActionData,
): Promise<unknown> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    const username = await settings.getSetting('trackingName');

    await got
      .post(`${API_URL}/operation/${state.operation.id}/action`, {
        json: {
          name,
          value: JSON.stringify(value),
          success: data?.success,
          username,
        },
      })
      .json<CreateOperationActionResult>();
  } catch (err) {
    console.error(err);
  }
}

export async function updateOperationResult(data: UpdateData): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (data.result) {
    state.operation.result = data.result;
  }

  try {
    await got.put(`${API_URL}/operation/${state.operation.id}`, {
      json: data,
    });
  } catch (err) {
    console.error(err);
  }
}

type CreateOperationActionResult = {
  operationId?: string;
};

type UpdateData = {
  result?: i.OperationResult;
  error?: string;
};

type ActionData = {
  success?: boolean;
  error?: string;
};
