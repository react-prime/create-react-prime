import { logger, Jsondb } from '@crp';
import * as lowdb from 'lowdb';

vi.mock('lowdb', () => ({
  Low: function () {
    return {
      data: {
        tracking: 'foo',
        trackingName: 'bar',
      },
      read: vi.fn().mockResolvedValue(void 0),
      write: vi.fn().mockResolvedValue(void 0),
    };
  },
  JSONFile: vi.fn(),
}));

describe('Settings', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Returns a setting value', async () => {
    const settings = new Jsondb();

    expect(await settings.getSetting('tracking')).toEqual('foo');
    expect(await settings.getSetting('trackingName')).toEqual('bar');
  });

  it('Sets a setting value', async () => {
    const settings = new Jsondb();

    await settings.setSetting('tracking', 'anonymous');

    expect(await settings.getSetting('tracking')).toEqual('anonymous');
  });

  it('Sets the default values if data is null', async () => {
    // @ts-ignore
    lowdb.Low = function () {
      return {
        data: undefined,
      };
    };

    const settings = new Jsondb();
    const initSpy = vi
      .spyOn(Jsondb.prototype as any, 'init')
      .mockResolvedValue(void 0);

    await settings.getSetting('tracking');

    expect(initSpy).toHaveBeenCalled();
  });

  it('Errors when something goes wrong', async () => {
    // @ts-ignore
    lowdb.Low = function () {
      return {
        read: vi.fn().mockRejectedValue(new Error('foo')),
        write: vi.fn().mockRejectedValue(new Error('bar')),
      };
    };

    const settings = new Jsondb();

    vi.spyOn(Jsondb.prototype as any, 'init').mockRejectedValue(void 0);
    const errorSpy = vi
      .spyOn(logger, 'error')
      .mockImplementation(() => void 0 as never);

    await settings.getSetting('tracking');
    await settings.setSetting('tracking', 'anonymous');

    expect(errorSpy).toBeCalledTimes(2);
  });
});
