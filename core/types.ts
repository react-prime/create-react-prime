import * as i from 'types';
import {
  Answers, CheckboxQuestion, InputQuestion, InputQuestionOptions, ListQuestion, NumberQuestion,
} from 'inquirer';

import StepList from 'core/StepList';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArr = any[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Newable<T = any> extends Function {
  new (...args: i.AnyArr): T;
}

export interface Question {
  options: i.QuestionOptions;
  answer: (answers: Answers) => void | Promise<void>;
}

export interface Step {
  name: string;
  after: string;
  on: (options: i.StepOptions) => void | Promise<void>;
  spinner: i.SpinnerOptions;
}

export interface Installer {
  name: string;
  steps: StepList;
  beforeInstall: () => void;
  afterInstall: () => void;
}

export interface InstallerOptions {
  name: string;
  repositoryUrl: string;
  steps?: i.Newable[];
  questions?: i.Newable[];
}

export type StepOptions = Omit<i.InstallerOptions, 'steps' | 'questions'>;

// eslint-disable-next-line max-len
type QuestionOptionsBase = InputQuestionOptions & {
  beforeInstall?: boolean;
  afterInstall?: boolean;
  after?: string;
  OS?: ('windows' | 'mac' | 'linux')[];
}

export type QuestionOptions = QuestionOptionsBase & (
  | InputQuestion
  | NumberQuestion
  | ListQuestion
  | CheckboxQuestion
)

export interface SpinnerOptions {
  emoji: string;
  message: {
    pending: () => string;
    success: () => string;
  }
}
