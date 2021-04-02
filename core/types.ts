import StepList from 'core/StepList';


// eslint-disable-next-line
export interface Newable<T = any> extends Function {
  // eslint-disable-next-line
  new (...args: any[]): T;
}

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
