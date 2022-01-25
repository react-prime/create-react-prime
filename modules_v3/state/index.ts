import { produce } from 'immer';

import type { State, StateKeys, DraftFn } from './types';


// State as map with immer setter
const map = new Map<StateKeys, State[StateKeys]>();

const state = (() => {
  map.set('answers', {});

  async function set<K extends StateKeys, F extends DraftFn<K>>(key: K, fn: F): Promise<State[K]> {
    if (typeof fn === 'function') {
      /** @TODO fix map.get type issue */
      // @ts-ignore
      const next: State[K] = await produce<Promise<State[K]>>(map.get(key), fn);
      map.set(key, next);
    } else {
      map.set(key, fn);
    }

    return map.get(key) as State[K];
  }

  function setSync<K extends StateKeys, F extends DraftFn<K>>(key: K, fn: F): State[K] {
    if (typeof fn === 'function') {
      /** @TODO fix map.get type issue */
      // @ts-ignore
      const next = produce<State[K]>(map.get(key), fn);
      map.set(key, next);
    } else {
      map.set(key, fn);
    }

    return map.get(key) as State[K];
  }

  return {
    // Returning map.get as function fixes an out-of-sync receiver issue
    get: (key: StateKeys) => map.get(key),
    set,
    setSync,
  };
})();

export const __DO_NOT_USE__STATE_MAP__ = map;

export default state;
