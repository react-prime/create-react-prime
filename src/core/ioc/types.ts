import * as i from '../types';
import commander from 'commander';
import { Answers } from 'inquirer';

import InstallStep from '../InstallStep';


export type AppType = {
  install(): Promise<void>;
  prompt(type: 'pre' | 'post'): Promise<void>;
  end(): void;
}

export type CLIMgrType = {
  cli: commander.Command;
  lang: i.InstallLangs;
  installationLangConfig: i.LangConfig;
  installationConfig?: i.InstallationConfig;
  installBoilerplate?: i.BoilerplateTypes;
  projectName?: string;
  isDebugging: boolean;
  skipSteps: i.InstallStepIds[];
  skipOptionalQuestions: boolean;
};

export interface LoggerType {
  msg(...str: i.AnyArr): void;
  warning(...reason: i.AnyArr): void;
  error(...str: i.AnyArr): void;
  debug(...reason: i.AnyArr): void;
  whitespace(): void;
}

export type InstallerType = {
  init(): void;
  install(): Promise<void>;
}

export type InstallStepType = {
  options: i.InstallStepOptions;
  id: i.InstallStepIds;
  message: i.InstallMessage;
  cmd: string | undefined;
  previous: InstallStep | undefined;
  next: InstallStep | undefined;
  modify(
    stepOptions: Partial<i.InstallStepOptions> | ((step: InstallStep) => Partial<i.InstallStepOptions>)
  ): InstallStep;
}

export type GetProjectPackage = {
  path: string;
  json: i.PackageJson;
}

export type PackageMgrType = {
  package: i.GetProjectPackage;
  write(npmPkg: i.PackageJson): Promise<void>;
  update(npmPkg?: i.PackageJson): Promise<void>;
}

export type PromptType = {
  ask(when: i.PromptWhen): Promise<Answers>;
  answer(when: i.PromptWhen, answers: Answers): Promise<void>;
}

export type StepsType = InstallStep[] & {
  init(): void;
  add(...options: i.InstallStepOptions[]): i.StepsType;
}
