import { INSTALL_STEP } from 'installers/steps';

export * from 'ioc/types';
export * from 'prompt/types';

export type ValueOf<T> = T[keyof T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArr = any[];

export type InstallStepIds = typeof INSTALL_STEP[number];

export type Json = string | number | boolean | { [key: string]: Json } | Json[] | null;

export type PackageJson = {
  scripts?: Record<string, string>;
  repository?: {
    url: string;
    [key: string]: string;
  };
  [key: string]: Json | undefined;
}

export type InstallMessage = {
  pending: string;
  success: string;
  fail?: string;
};

type InstallStepOptionsBase = {
  /** Unique identifier for this step. */
  id: InstallStepIds;
  /** Message displayed when this step is being executed and is done executing. */
  message: InstallMessage;
  /** Emoji displayed between spinner and message. */
  emoji: string;
}

type InstallStepOptionsCmd = {
  /** Used for command line scripts. */
  cmd: string;
  fn?: string | (() => Promise<void>);
}

type InstallStepOptionsFn = {
  cmd?: string;
  /**
   * Used for anything that should be executed with JavaScript,
   * or is easier to translate into JavaScript rather than a command line script.
   * Can be used together with a command line script from `cmd`. This function will always run
   * after the command line script is finished executing.
   */
  fn: string | (() => Promise<void>);
}

// This type makes sure least one of 'cmd' or 'fn' is present
export type InstallStepOptions = InstallStepOptionsBase & (
  | InstallStepOptionsCmd
  | InstallStepOptionsFn
)
