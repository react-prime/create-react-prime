import { closeApp } from '@crp';
import * as db from '@crp/db';

describe('closeApp', () => {
  const exitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => void 0 as never);
  const dbSpy = vi.spyOn(db, 'db', 'get').mockReturnValue({
    $disconnect: () => Promise.resolve(),
  } as any);

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('Runs the operation result DB update', async () => {
    const spy = vi.spyOn(db, 'updateOperationResult').mockResolvedValueOnce();

    await closeApp();

    expect(spy).toBeCalledWith('success');
  });

  it('Disconnects from the db', async () => {
    await closeApp();

    expect(dbSpy).toBeCalled();
  });

  it('Exits the program', async () => {
    await closeApp();

    expect(exitSpy).toBeCalledWith();
  });
});
