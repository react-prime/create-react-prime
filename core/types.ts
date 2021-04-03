import StepList from 'core/StepList';


// eslint-disable-next-line
export interface Newable<T = any> extends Function {
  // eslint-disable-next-line
  new (...args: any[]): T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArr = any[];

export interface Step {
  name: string;
  after: string;
  on: () => void;
}

export interface Installer {
  name: string;
  repositoryUrl: string;
  steps: StepList;
  beforeInstall: () => void;
  afterInstall: () => void;
}
