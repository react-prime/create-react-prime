import type { State, StateKeys } from './types';

// State as map with immer setter
export const map = new Map<StateKeys, State[StateKeys]>();

// Answers given by user in CLI
map.set('answers', {});
