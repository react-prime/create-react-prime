import type { Ora } from 'ora';
import { type SpyInstance, spyOn } from 'vitest';
import { createSpinner, logger, type CreateSpinner } from '@crp';
import { LOG_PREFIX } from '@crp/constants';


describe('createSpinner', () => {
  let _spinner: CreateSpinner;
  let spinnerStartMock: SpyInstance<[text?: string | undefined], Ora>;
  let spinnerSucceedMock: SpyInstance<[text?: string | undefined], Ora>;

  beforeEach(() => {
    const fn = () => Promise.resolve();

    _spinner = createSpinner(fn, {
      start: 'start',
      success: 'success',
      fail: 'fail',
    });

    spinnerStartMock = spyOn(_spinner.spinner, 'start').mockImplementationOnce(() => _spinner.spinner);
    spinnerSucceedMock = spyOn(_spinner.spinner, 'succeed').mockImplementationOnce(() => _spinner.spinner);
  });

  afterAll(() => {
    spinnerStartMock.mockRestore();
    spinnerSucceedMock.mockRestore();
  });

  it('Returns the spinner and a start function', () => {
    expect(_spinner).toBeDefined();
    expect(_spinner.spinner).toBeDefined();
    expect(_spinner.start).toBeDefined();
  });

  it('Returns a valid spinner', () => {
    const { spinner } = _spinner;
    expect(spinner.color).toEqual('yellow');
    expect(spinner.prefixText).toEqual(LOG_PREFIX);
    expect(spinner.text).toEqual('start');
  });

  it('Has not started spinning on create', () => {
    const { spinner } = _spinner;
    expect(spinner.isSpinning).toBeFalsy();
  });

  it('Starts spinning on start', async () => {
    const { spinner, start } = _spinner;

    expect(spinner.isSpinning).toBeFalsy();
    await start();
    expect(spinnerStartMock).toBeCalled();
  });

  it('Stops spinning on success', async () => {
    const { start } = _spinner;
    await start();
    expect(spinnerSucceedMock).toBeCalled();
  });

  it('Stops spinning on fail', async () => {
    const fn = () => new Promise((_, fail) => fail());

    const { spinner, start } = createSpinner(fn, {
      start: 'start',
      success: 'success',
      fail: 'fail',
    });

    // @ts-ignore
    const logMock = spyOn(logger, 'error').mockImplementationOnce(() => void {});
    spyOn(logger, 'whitespace').mockImplementationOnce(() => void {});
    spyOn(spinner, 'start').mockImplementationOnce(() => _spinner.spinner);
    const spinnerFailMock = spyOn(spinner, 'fail').mockImplementationOnce(() => _spinner.spinner);
    await start();
    expect(spinnerFailMock).toBeCalled();
    expect(logMock).toBeCalled();
  });
});