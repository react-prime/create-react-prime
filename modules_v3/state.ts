import { produce } from 'immer';


type State = {
  answers: {
    projectName?: string;
    renderType?: string;
    boilerplate?: string;
    cms?: string;
    modules?: string[];
    openInEditor?: string;
  }
};

type StateKeys = keyof State;

type DraftFn<K extends StateKeys> =
  | ((draft: State[K]) => void)
  | State[K];

// State as map with immer setter
const map = new Map<StateKeys, State[StateKeys]>();

const state = (() => {
  map.set('answers', {});

  const set = async <K extends StateKeys, F extends DraftFn<K>>(key: K, fn: F): Promise<State[K]> => {
    if (typeof fn !== 'string') {
      /** @TODO fix Promise type issue */
      // @ts-ignore
      const next = await produce<Promise<State[K]>>(map.get(key), fn);
      map.set(key, next);
    } else {
      map.set(key, fn);
    }

    return map.get(key) as State[K];
  };

  return {
    // Returning map.get as function fixes an out-of-sync receiver issue
    get: (key: StateKeys) => map.get(key),
    set,
  };
})();

/** TESTS */
// state.set('answers', (answers) => {
//   answers.boilerplate = '';
//   return answers;
// });

// state.set('answers', { boilerplate: '' });

// state.set('foo', 'bar');
// state.set('foo', () => 'bar');

export default state;
