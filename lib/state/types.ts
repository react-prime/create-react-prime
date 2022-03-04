export type State = {
  answers: CRPAnswers;
  operation: CRPOperation;
};

export type StateKeys = keyof State;

export type CRPOperation = {
  id: string;
  result: 'unfinished' | OperationResult;
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

export type OperationResult = 'success' | 'error' | 'exited';

export type ChoiceItem = {
  name: string;
  value: EditorSearchItem;
};

export type EditorSearchItem = {
  name: string;
  search: string;
  path?: string;
};
