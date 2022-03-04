export type State = {
  answers: CRPAnswers;
  session: CRPSession;
};

export type StateKeys = keyof State;

export type CRPSession = {
  id: string;
  result: 'unfinished' | SessionResult;
};

export type CRPAnswers = {
  // projectName and boilerplate are secured by proxy
  projectName: string;
  boilerplate: string;
  entry?: Entry;
  renderType?: string;
  cms?: string;
  modules?: string[];
  openInEditor?: EditorSearchItem;
};

export type Entry = 'boilerplate' | null;

export type SessionResult = 'success' | 'error' | 'exited';

export type ChoiceItem = {
  name: string;
  value: EditorSearchItem;
};

export type EditorSearchItem = {
  name: string;
  search: string;
  path?: string;
};
