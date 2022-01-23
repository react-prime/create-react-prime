type State = {
  projectName?: string;
  renderType?: 'ssr' | 'csr';
  boilerplate?: 'react-web' | 'react-mobile';
}

// Monkeypatch maps to return correct types
const state = (() => {
  const map = new Map<keyof State, State[keyof State]>();
  const set = <K extends keyof State>(k: K, v: State[K]) => map.set(k, v);
  const get = <K extends keyof State>(k: K): State[K] => (map as Map<K, State[K]>).get(k);

  return { ...map, set, get };
})();

export default state;
