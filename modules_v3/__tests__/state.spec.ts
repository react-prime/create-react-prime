import { expect, it, describe, beforeEach } from 'vitest';

import state from '../lib/state';


describe('State', () => {
  beforeEach(() => {
    state.answers = {};
  });

  it('Gets the data from state', () => {
    expect(state.answers).toStrictEqual({});
  });

  it('Starts with the correct default state', () => {
    // This should error if we add more keys to the state
    expect(Object.keys(state).length).toEqual(1);

    for (const key in state) {
      expect(state[key]).toStrictEqual({});
    }
  });

  it('Stores data to state (sync)', () => {
    expect(state.answers).toStrictEqual({});

    state.answers.boilerplate = 'foo';

    expect(state.answers).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    state.foo = 'bar';
    // @ts-expect-error
    expect(state.foo).toEqual('bar');
  });

  it('Stores data to state (async)', async () => {
    expect(state.answers).toStrictEqual({});

    state.answers.boilerplate = await Promise.resolve('foo');

    expect(state.answers).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    state.foo = await Promise.resolve('bar');
    // @ts-expect-error
    expect(state.foo).toEqual('bar');
  });
});
