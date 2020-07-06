import * as i from 'types';
import commander from 'commander';
import Installer from 'installers/Installer';
import InstallStep from '../InstallStep';
import InstallStepList from '../InstallStepList';

export type InstallerCfg = {
  /** Boilerplate name */
  name: string;
  /** Boilerplate repository name */
  repository: string;
  installer: typeof Installer;
}

export type AppType = {
  start(): Promise<void>;
}

export type CLIMgrType = {
  cli: commander.Command;
  projectName: string;
  installType: string;
  installRepository: string;
  isDebugging: boolean | undefined;
  skipSteps: i.InstallStepIds[] | undefined;
};

export type LoggerType = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  warning(...reason: any[]): void;
  error(...str: any[]): void;
  debug(...reason: any[]): void;
  /* eslint-enable */
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
