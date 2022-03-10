import got from 'got';
import { settings, state } from '@crp';

import { createOperation, logAction, updateOperationResult } from '..';

describe('db', () => {
  const API_URL = 'https://create-react-prime-dashboard.vercel.app/api';

  const postSpy = vi.spyOn(got, 'post').mockReturnValue({
    json: vi.fn().mockResolvedValue({
      operationId: 'operation-test-id',
    }),
  } as any);
  const patchSpy = vi
    .spyOn(got, 'patch')
    .mockImplementation(() => void {} as any);
  const settingsSpy = vi
    .spyOn(settings, 'getSetting')
    .mockResolvedValue('test-name');

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('createOperation', () => {
    it('Correctly creates a new operation', async () => {
      await createOperation();

      expect(settingsSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalledWith(`${API_URL}/operation`, {
        json: {
          username: 'test-name',
        },
      });
    });

    it('Stores the operation ID in state', async () => {
      await createOperation();

      expect(state.operation.id).toBe('operation-test-id');
    });
  });

  describe('logAction', () => {
    it('Correctly logs an action', async () => {
      state.operation.id = 'operation-test-id';

      await logAction('test-action', 'test-value');

      expect(postSpy).toHaveBeenCalledWith(
        `${API_URL}/operation/${state.operation.id}/action`,
        {
          json: {
            name: 'test-action',
            value: JSON.stringify('test-value'),
            success: undefined,
            username: 'test-name',
          },
        },
      );
    });

    it('Correctly logs an action with data', async () => {
      state.operation.id = 'operation-test-id';

      await logAction('test-action', 'test-value', {
        success: true,
      });

      expect(postSpy).toHaveBeenCalledWith(
        `${API_URL}/operation/${state.operation.id}/action`,
        {
          json: {
            name: 'test-action',
            value: JSON.stringify('test-value'),
            success: true,
            username: 'test-name',
          },
        },
      );
    });
  });

  describe('updateOperationResult', () => {
    it('Correctly updates the operation result', async () => {
      state.operation.id = 'operation-test-id';

      await updateOperationResult({
        result: 'success',
      });

      expect(patchSpy).toHaveBeenCalledWith(
        `${API_URL}/operation/${state.operation.id}`,
        {
          json: {
            result: 'success',
          },
        },
      );
    });

    it('Stores the result in state', async () => {
      await updateOperationResult({
        result: 'success',
      });

      expect(state.operation.result).toBe('success');
    });
  });
});
