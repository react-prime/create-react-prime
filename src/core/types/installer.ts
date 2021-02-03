import * as i from '.';

import Installer from '../Installer';
import Steps from '../Steps';
import Prompt from '../Prompt';

import STEPS from '../../modules/steps/identifiers';


export type InstallLangs = 'js';
export type BoilerplateTypes = 'client' | 'ssr' | 'native';

export type InstallStepIds = i.ValueOf<typeof STEPS>;

export type InstallMessage = {
  pending: string;
  success: string;
  fail?: string;
};

// This type makes sure least one of 'cmd' or 'fn' is present
export type InstallStepOptions = {
  /** Unique identifier for this step. */
  id: InstallStepIds;
  /** Message displayed when this step is being executed and is done executing. */
  message: InstallMessage;
  /** Emoji displayed between spinner and message. */
  emoji: string;
  /** Used for command line scripts. */
  cmd?: string;
};

export type Vc = {
  host: string;
  owner: string;
}

export type InstructionsConfig = {
  quickstart: string[];
  allCommands?: {
    cmd: string;
    desc: string;
  }[];
};

export type InstallationConfig = {
  name: string;
  repository: string;
  vc: i.Vc;
  description: string;
  installer: typeof Installer;
  prompt?: typeof Prompt;
  steps?: typeof Steps;
  instructions?: Partial<i.InstructionsConfig>;
}

export type LangConfig = {
  steps: typeof Steps;
  prompt?: typeof Prompt;
  instructions: i.InstructionsConfig;
  boilerplates: {
    [boilerplate: string]: i.InstallationConfig;
  };
};

export type InstallersConfig = {
  [lang: string]: i.LangConfig;
}
