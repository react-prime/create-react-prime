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
  openInEditor?: string;
};


const state: State = {
  answers: {},
};

export default state;
