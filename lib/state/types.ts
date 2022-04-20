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
  tracking: TrackingItem;
  entry?: Entry;
  renderType?: string;
  cms?: string;
  modules?: Modules[];
  components?: Components[];
  openInEditor?: EditorSearchItem;
};

export type Entry = 'boilerplate' | null;

export type OperationResult = 'success' | 'error' | 'exited';

export type ChoiceItem = {
  name: string;
  value: EditorSearchItem | null;
};

export type EditorSearchItem = {
  name: string;
  search: string;
  path?: string;
};

export type TrackingItem = {
  name: string;
  value: Tracking;
};

export type Tracking = 'anonymous' | 'choose' | 'git';

export type Modules =
  | 'api-helper'
  | 'manual-deploy'
  | 'continuous-deploy'
  | 'use-authentication'
  | 'sentry';

export type ModuleItem = {
  name: string;
  value: Modules;
};

export type Components = string;

export type ComponentItem = {
  name: string;
  value: Components;
};
