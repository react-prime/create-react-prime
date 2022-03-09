import { logger, settings } from '@crp';
import * as crpUtils from '@crp/utils';

import * as entry from '../actions/entry';
import * as question from '../../modules/questions';

vi.mock('git-user-name', () => ({
  default: vi.fn(() => 'John Doe'),
}));

describe('Entry', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('Finds the entry point of a given option', async () => {
    const action = await entry.getActionForOption({ boilerplate: true });
    expect(action).toBeDefined();
  });

  it('Prompts for entry point if entry point is not found', async () => {
    const promptSpy = vi
      .spyOn(question, 'entry')
      .mockResolvedValue('boilerplate');

    let action = await entry.getActionForOption({});

    expect(action).toBeDefined();
    expect(promptSpy).toHaveBeenCalledTimes(1);

    // @ts-expect-error
    action = await entry.getActionForOption({ foo: true });

    expect(action).toBeDefined();
    expect(promptSpy).toHaveBeenCalledTimes(2);
  });

  it('Exits if user chooses to exit', async () => {
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce(() => void 0 as never);
    const promptSpy = vi
      .spyOn(question, 'entry')
      .mockImplementationOnce(() => Promise.resolve(null));

    const action = await entry.getActionForOption({});

    expect(action).toBeDefined();
    expect(promptSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalled();
  });

  /** @TODO spy isn't tracking correctly -- idk why */
  // it('Starts tracking and returns action', async () => {
  //   const initTrackingSpy = vi.spyOn(entry, 'initTracking').mockResolvedValue();
  //   const getActionSpy = vi
  //     .spyOn(entry, 'getActionForOption')
  //     .mockResolvedValue(() => Promise.resolve());

  //   const action = await entry.entry({
  //     boilerplate: true,
  //   });

  //   expect(initTrackingSpy).toHaveBeenCalled();
  //   expect(getActionSpy).toHaveBeenCalled();
  //   expect(action).toBeDefined();
  // });

  describe('initTracking', () => {
    vi.spyOn(logger, 'whitespace').mockImplementation(() => void 0);
    const loggerMsgSpy = vi
      .spyOn(logger, 'msg')
      .mockImplementation(() => void 0);
    const setSettingSpy = vi.spyOn(settings, 'setSetting').mockResolvedValue();
    const spinnerStartMock = vi.fn(() => Promise.resolve());
    vi.spyOn(crpUtils, 'createSpinner').mockImplementation(() => {
      return {
        start: spinnerStartMock,
      } as any;
    });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('Asks for tracking if no setting is found, no option is given', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      const questionSpy = vi
        .spyOn(question, 'tracking')
        .mockResolvedValueOnce('git');

      await entry.initTracking({});

      expect(questionSpy).toHaveBeenCalled();
    });

    it('Asks for tracking if no setting is found, option is given', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      const questionSpy = vi
        .spyOn(question, 'tracking')
        .mockResolvedValueOnce('git');

      await entry.initTracking({ tracking: true });

      expect(questionSpy).toHaveBeenCalled();
    });

    it('Asks for tracking if setting is found and option is given', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce('git');
      const questionSpy = vi
        .spyOn(question, 'tracking')
        .mockResolvedValueOnce('git');

      await entry.initTracking({ tracking: true });

      expect(questionSpy).toHaveBeenCalled();
    });

    it('Does not ask if setting is found and no option is given', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce('git');
      const questionSpy = vi
        .spyOn(question, 'tracking')
        .mockResolvedValueOnce('git');

      await entry.initTracking({});

      expect(questionSpy).not.toHaveBeenCalled();
    });

    it('Sets the tracking setting with the given answer', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      vi.spyOn(question, 'tracking').mockResolvedValueOnce('git');

      await entry.initTracking({});

      expect(setSettingSpy).toHaveBeenCalledWith('tracking', 'git');
    });

    it('Starts the spinner', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      vi.spyOn(question, 'tracking').mockResolvedValueOnce('git');

      await entry.initTracking({});

      expect(spinnerStartMock).toHaveBeenCalled();
    });

    it('Prints a message that tracking is enabled with the given name and the option to change', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      vi.spyOn(question, 'tracking').mockResolvedValueOnce('git');

      await entry.initTracking({});

      expect(loggerMsgSpy).toHaveBeenCalledWith(
        // eslint-disable-next-line quotes
        "Tracking enabled and set as 'John Doe'. To change, run: 'npx create-react-prime --tracking'",
      );
    });

    it('Asks for user input if user chooses "choose"', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      vi.spyOn(question, 'tracking').mockResolvedValueOnce('choose');
      const trackingNameSpy = vi
        .spyOn(question, 'trackingName')
        .mockResolvedValueOnce('jane doe');

      await entry.initTracking({});

      expect(trackingNameSpy).toHaveBeenCalled();
      expect(setSettingSpy).toHaveBeenCalledWith('tracking', 'choose');
      expect(setSettingSpy).toHaveBeenCalledWith('trackingName', 'jane doe');
    });

    it('Sets name as "Anonymous" if chosen', async () => {
      vi.spyOn(settings, 'getSetting').mockResolvedValueOnce(undefined);
      vi.spyOn(question, 'tracking').mockResolvedValueOnce('anonymous');

      await entry.initTracking({});

      expect(setSettingSpy).toHaveBeenCalledWith('tracking', 'anonymous');
      expect(setSettingSpy).toHaveBeenCalledWith('trackingName', 'Anonymous');
    });
  });
});
