export type State = {
  answers: CRPAnswers;
};

export type StateKeys = keyof State;

export type CRPAnswers = {
  projectName?: string;
  renderType?: string;
  boilerplate?: string;
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


const state: State = {
  answers: {},
};

export default state;
