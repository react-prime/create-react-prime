import * as i from 'types';
import {
  Answers, CheckboxQuestion, InputQuestion, InputQuestionOptions, ListQuestion, NumberQuestion,
} from 'inquirer';


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
  on: (args: i.InstallStepArgs) => void | Promise<void>;
  spinner: i.SpinnerOptions;
}

export interface Installer {
  options: i.InstallStepArgs;
  steps: i.Newable[];
  questions?: i.QuestionsObj<i.Newable<i.Question>[]>;
  beforeInstall?: () => void | Promise<void>;
  afterInstall?: () => void | Promise<void>;
}

export interface InstallerOptions {
  name: string;
  cloneUrl: string;
  steps?: i.Newable[];
  questions?: i.Newable[];
}

export type InstallStepArgs = Omit<InstallerOptions, 'steps' | 'questions'>;

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

export interface StepOptions {
  name: string;
  after?: string;
  spinner: i.SpinnerOptions;
}

export interface SpinnerOptions {
  emoji: string;
  message: {
    pending: () => string;
    success: () => string;
  }
}

export type QuestionWhen = 'before' | 'after';

export type QuestionsObj<T> = {
  [key in QuestionWhen]: T;
}

export type Json = string | number | boolean | { [key: string]: Json } | Json[] | null;
