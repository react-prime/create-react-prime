import type * as i from 'types';
import got from 'got';
import { state, settings, cli } from '@crp';

import { getApiUrl } from './url';

export async function createOperation(): Promise<void> {
  try {
    const username = await settings.getSetting('trackingName');

    const result = await got
      .post(`${getApiUrl()}/operation`, {
        json: {
          username,
        },
      })
      .json<CreateOperationActionResponse>();

    if ('operationId' in result) {
      state.operation.id = result.operationId;
    }
  } catch (err) {
    if (cli.getOptions().debug) {
      console.error(err);
    }
  }
}

export async function logAction(
  name: string,
  value?: unknown,
  data?: ActionData,
): Promise<void> {
  try {
    const username = await settings.getSetting('trackingName');

    await got
      .post(`${getApiUrl()}/operation/${state.operation.id}/action`, {
        json: {
          name,
          value: JSON.stringify(value),
          success: data?.success,
          username,
        },
      })
      .json<CreateOperationActionResponse>();
  } catch (err) {
    if (cli.getOptions().debug) {
      console.error(err);
    }
  }
}

export async function updateOperationResult(data: UpdateData): Promise<void> {
  if (data.result) {
    state.operation.result = data.result;
  }

  try {
    await got.patch(`${getApiUrl()}/operation/${state.operation.id}`, {
      json: data,
    });
  } catch (err) {
    if (cli.getOptions().debug) {
      console.error(err);
    }
  }
}

type CreateOperationActionResponse =
  | ErrorResponse
  | {
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

type ErrorResponse = {
  errors: Error[];
};

type Error = {
  target: Target;
  property: string;
  children: unknown[];
  constraints: Constraints;
};

type Constraints = {
  isString: string;
};

type Target = Record<string, unknown>;
