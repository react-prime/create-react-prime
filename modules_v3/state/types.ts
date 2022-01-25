export type State = {
  answers: {
    projectName?: string;
    renderType?: string;
    boilerplate?: string;
    cms?: string;
    modules?: string[];
    openInEditor?: string;
  }
};

export type StateKeys = keyof State;

export type DraftFn<K extends StateKeys> =
  | ((draft: State[K]) => void)
  | State[K];
