import { produce } from 'immer';


type State = {
  answers: {
    projectName?: string;
    renderType?: string;
    boilerplate?: string;
    cms?: string;
    modules?: string[];
    openInEditor?: string;
  };
}

type StateKeys = keyof State

type DraftFn<K extends StateKeys> =
  | ((draft: State[K]) => State[K] | Promise<State[K]>)
  | State[K]

// State as map with immer setter
const state = (() => {
  const map = new Map<StateKeys, State[StateKeys]>();

  map.set('answers', {});

  const set = async <K extends StateKeys, F extends DraftFn<K>>(key: K, fn: F): Promise<State[K]> => {
    if (typeof fn !== 'string') {
      /** @TODO fix Promise type issue */
      // @ts-ignore
      return await produce<Promise<State[K]>>(map.get(key), fn);
    } else {
      map.set(key, fn);
      return map.get(key) as State[K];
    }
  };

  return {
    get: map.get,
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
