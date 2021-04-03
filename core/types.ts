import * as i from 'types';
import StepList from 'core/StepList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArr = any[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Newable<T = any> extends Function {
  new (...args: i.AnyArr): T;
}

export interface Step {
  name: string;
  after: string;
  on: (options: i.StepOptions) => void;
}

export interface Installer {
  name: string;
  repositoryUrl: string;
  steps: StepList;
  beforeInstall: () => void;
  afterInstall: () => void;
}

export interface InstallerOptions {
  name: string;
  repositoryUrl: string;
  steps?: i.Newable[];
  prompts?: i.Newable[];
}

export type StepOptions = Omit<i.InstallerOptions, 'steps' | 'prompts'>;
