/* eslint-disable @typescript-eslint/no-var-requires */
import os from 'os';
import fs from 'fs';

import Validate from 'core/Validate';

jest.mock('fs');
jest.mock('os');

// Type cast as mocked
const osMock = os as jest.Mocked<typeof os>;
const fsMock = fs as jest.Mocked<typeof fs>;


describe('Validate', () => {
  let validate: Validate;

  beforeEach(() => {
    validate = new Validate();
  });

  it('Validates a foldername on Mac OS', () => {
    // invalid
    expect(validate.folderName('/')).toBeFalsy();
    expect(validate.folderName(':')).toBeFalsy();
    expect(validate.folderName('a:name')).toBeFalsy();
    expect(validate.folderName('a/name')).toBeFalsy();

    // valid
    expect(validate.folderName('name')).toBeTruthy();
    expect(validate.folderName('a name')).toBeTruthy();
    expect(validate.folderName('a-name')).toBeTruthy();
    expect(validate.folderName('a_name')).toBeTruthy();
    expect(validate.folderName('A Name')).toBeTruthy();
  });

  it('Validates a foldername on Windows OS', () => {
    const mock = jest.fn();
    mock.mockReturnValue('WINDOWS_NT');

    const orgTypeFn = osMock.type;
    osMock.type = mock;

    // invalid
    // to test all combinations it would cost 12 * 11 * 10... tests
    // this should be enough...
    expect(validate.folderName('^')).toBeFalsy();
    expect(validate.folderName('\\')).toBeFalsy();
    expect(validate.folderName('/')).toBeFalsy();
    expect(validate.folderName('?')).toBeFalsy();
    expect(validate.folderName('*')).toBeFalsy();
    expect(validate.folderName(':')).toBeFalsy();
    expect(validate.folderName('|')).toBeFalsy();
    expect(validate.folderName('"')).toBeFalsy();
    expect(validate.folderName('<')).toBeFalsy();
    expect(validate.folderName('>')).toBeFalsy();
    expect(validate.folderName(' ')).toBeFalsy();
    expect(validate.folderName('^\\')).toBeFalsy();
    expect(validate.folderName('^/')).toBeFalsy();
    expect(validate.folderName('^?')).toBeFalsy();
    expect(validate.folderName('^*')).toBeFalsy();
    expect(validate.folderName('^:')).toBeFalsy();
    expect(validate.folderName('^|')).toBeFalsy();
    expect(validate.folderName('^"')).toBeFalsy();
    expect(validate.folderName('^<')).toBeFalsy();
    expect(validate.folderName('^>')).toBeFalsy();

    // valid
    expect(validate.folderName('name')).toBeTruthy();
    expect(validate.folderName('a-name')).toBeTruthy();
    expect(validate.folderName('a_name')).toBeTruthy();
    expect(validate.folderName('A-Name')).toBeTruthy();

    osMock.type = orgTypeFn;
  });

  it('Validates a foldername on Linux OS', () => {
    const mock = jest.fn();
    mock.mockReturnValue('Linux');

    const orgTypeFn = osMock.type;
    osMock.type = mock;

    // invalid
    expect(validate.folderName('/')).toBeFalsy();
    expect(validate.folderName('a/name')).toBeFalsy();

    // valid
    expect(validate.folderName('name')).toBeTruthy();
    expect(validate.folderName('a name')).toBeTruthy();
    expect(validate.folderName('a-name')).toBeTruthy();
    expect(validate.folderName('a_name')).toBeTruthy();
    expect(validate.folderName('A-Name')).toBeTruthy();

    osMock.type = orgTypeFn;
  });

  it('Checks if a folder exists', () => {
    const mock = jest.fn();
    const orgExistsFn = fsMock.existsSync;
    fsMock.existsSync = mock;

    mock.mockReturnValue(false);
    expect(validate.folderExists('name')).toBeFalsy();

    mock.mockReturnValue(true);
    expect(validate.folderExists('name')).toBeTruthy();

    fsMock.existsSync = orgExistsFn;
  });
});
