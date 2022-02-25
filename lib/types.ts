import type * as i from 'types';
import type {
  Answers, CheckboxQuestion, InputQuestion, InputQuestionOptions, ListQuestion, NumberQuestion,
} from 'inquirer';
import type { OptionValues } from 'commander';
import type { JsonPrimitive, SetRequired } from 'type-fest';


export * from './generated/types';
export * from './state/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArr = any[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Newable<T = any> extends Function {
  new (...args: i.AnyArr): T;
}

type WhenFn = (answers: Answers) => boolean;

export interface Question {
  options: i.QuestionOptions;
  answer: (answers: Answers) => void | Promise<void>;
  when?: WhenFn;
}

export interface Step {
  name: string;
  after: string;
  on: (args: i.InstallStepArgs) => void | Promise<void>;
  spinner: i.SpinnerOptions;
  when?: WhenFn;
}

export interface Installer {
  options: i.InstallStepArgs;
  steps: i.Newable[];
  questions?: i.Newable<i.Question>[];
  beforeInstall?: () => void | Promise<void>;
  afterInstall?: () => void | Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CLIOptionBase<T extends JsonPrimitive> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (flags: i.Opts, options: Record<string, any>) => void;
  getName(): string | undefined;
}

export interface CLIOption<T extends JsonPrimitive> extends
  SetRequired<i.CLIOptionOptions<T>, 'description' | 'defaultValue'>,
  CLIOptionBase<T> {}

export interface CLIOptionClass<T extends JsonPrimitive> extends Partial<CLIOptionBase<T>> {}

export interface InstallerOptions {
  name: string;
  cloneUrl: string;
  steps?: i.Newable[];
  questions?: i.Newable[];
}

export type InstallStepArgs = Omit<InstallerOptions, 'steps' | 'questions'>;

export type OSNames = 'windows' | 'mac' | 'linux';

// eslint-disable-next-line max-len
interface QuestionOptionsBase extends InputQuestionOptions {
  beforeInstall?: boolean;
  afterInstall?: boolean;
  after?: string;
  OS?: i.OSNames[];
}

export type QuestionOptions = QuestionOptionsBase & (
  | InputQuestion
  | NumberQuestion
  | ListQuestion
  | CheckboxQuestion
);

export interface CLIOptionOptions<T extends JsonPrimitive> {
  flags: `-${string}, --${string}` | `-${string}, --${string} <${string}>`;
  description?: string;
  defaultValue?: T;
  terminate?: boolean;
}

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

export type QuestionsObj<T> = Record<QuestionWhen, T>;

export interface Opts extends OptionValues {
  boilerplate?: string;
  labela?: boolean;
}

export interface Settings {
  labela: boolean;
}
