import { expect, it, describe, beforeEach } from 'vitest';

import state, { __DO_NOT_USE__STATE_MAP__ } from '../state';


describe('State', () => {
  beforeEach(() => {
    state.setSync('answers', {});
  });

  it('Returns a getter and setter', () => {
    // This should error if we add more getter/setters
    expect(Object.keys(state).length).toEqual(3);
    expect(state.get).toBeDefined();
    expect(state.set).toBeDefined();
    expect(state.setSync).toBeDefined();
  });

  it('Gets the data from state', () => {
    expect(state.get('answers')).toStrictEqual({});
  });

  it('Starts with the correct default state', () => {
    // This should error if we add more keys to the state
    expect([...__DO_NOT_USE__STATE_MAP__.keys()].length).toEqual(1);

    for (const key of __DO_NOT_USE__STATE_MAP__.keys()) {
      expect(state.get(key)).toStrictEqual({});
    }
  });

  it('Stores data to state (sync)', () => {
    expect(state.get('answers')).toStrictEqual({});

    state.setSync('answers', (answers) => {
      answers.boilerplate = 'foo';
    });

    expect(state.get('answers')).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    state.setSync('foo', 'bar');
    // @ts-expect-error
    expect(state.get('foo')).toEqual('bar');
  });

  it('Stores data to state (async)', async () => {
    expect(state.get('answers')).toStrictEqual({});

    await state.set('answers', (answers) => {
      answers.boilerplate = 'foo';
    });

    expect(state.get('answers')).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    await state.set('foo', 'bar');
    // @ts-expect-error
    expect(state.get('foo')).toEqual('bar');
  });

  it('Returns the new state after set (sync)', () => {
    expect(state.get('answers')).toStrictEqual({});

    const next = state.setSync('answers', (answers) => {
      answers.boilerplate = 'foo';
    });

    expect(next).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    const next2 = state.setSync('foo', 'bar');
    expect(next2).toEqual('bar');
  });

  it('Returns the new state after set (async)', async () => {
    expect(state.get('answers')).toStrictEqual({});

    const next = await state.set('answers', (answers) => {
      answers.boilerplate = 'foo';
    });

    expect(next).toStrictEqual({
      boilerplate: 'foo',
    });

    // @ts-expect-error
    const next2 = await state.set('foo', 'bar');
    expect(next2).toEqual('bar');
  });
});
