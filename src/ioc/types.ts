import * as i from 'types';
import commander from 'commander';
import { Answers } from 'inquirer';
import Installer from 'installers/Installer';
import { installerCfg } from 'installers/config';
import InstallStep from '../InstallStep';
import InstallStepList from '../InstallStepList';


export type InstallType = typeof installerCfg[number]['name'];

export type InstallerCfg = {
  /** Boilerplate name */
  name: i.InstallType;
  /** Boilerplate repository name */
  repository: string;
  installer: typeof Installer;
}

export type AppType = {
  install(): Promise<void>;
  form(type: 'pre' | 'post'): Promise<void>;
  end(): void;
}

export type CLIMgrType = {
  cli: commander.Command;
  projectName?: string;
  installType?: i.InstallType;
  installRepository?: string;
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
  fn: (() => Promise<void>) | undefined;
  previous: InstallStep | undefined;
  next: InstallStep | undefined;
}

export type InstallStepListType = InstallStepType[] & {
  first: InstallStep | undefined;
  last: InstallStep | undefined;
  add(stepOptions: i.InstallStepOptions): InstallStepList;
  addAfterStep(stepId: i.InstallStepIds, stepOptions: i.InstallStepOptions): InstallStepList;
  modifyStep(stepId: i.InstallStepIds, stepOptions: Partial<i.InstallStepOptions>): InstallStepList;
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

export type QuestionsType = {
  init(): i.CRPQuestion[];
  ask(): Promise<Answers>;
  answer(answers: Answers): Promise<void>;
}
