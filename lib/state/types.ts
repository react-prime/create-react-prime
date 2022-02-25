export type State = {
  answers: CRPAnswers;
};

export type StateKeys = keyof State;

export type CRPAnswers = {
  // projectName and boilerplate are secured by proxy
  projectName: string;
  boilerplate: string;
  renderType?: string;
  cms?: string;
  modules?: string[];
  openInEditor?: EditorSearchItem;
};

export type ChoiceItem = {
  name: string;
  value: EditorSearchItem;
};

export type EditorSearchItem = {
  name: string;
  search: string;
  path?: string;
};
