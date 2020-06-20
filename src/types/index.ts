import { REPOSITORIES, INSTALL_STEP } from '../constants';

export type InstallerTypes = keyof typeof REPOSITORIES;

export type InstallStepId = keyof typeof INSTALL_STEP;

export type Json = string | number | boolean | { [key: string]: Json } | Json[] | null;

export type PackageJson = {
  scripts?: Record<string, string>;
  repository?: {
    url: string;
    [key: string]: string;
  };
  [key: string]: Json | undefined;
}

export type InstallStepOptions = {
  /** Unique identifier for this step. */
  id: symbol;
  /** Message displayed when this step is being executed. */
  message: string;
  /** Emoji displayed between spinner and message. */
  emoji: string;
  /** Used for command line scripts. */
  cmd?: string;
  /**
   * Used for anything that should be executed with JavaScript,
   * or is easier to translate into JavaScript rather than a command line script.
   * Can be used together with a command line script from `cmd`. This function will always run
   * after the command line script is finished executing.
   */
  fn?: () => Promise<void>;
}
