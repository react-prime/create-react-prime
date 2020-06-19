import { InstallerTypes, InstallStepOptions } from '../types';
import InstallStep from '../InstallStep';
import InstallStepList from '../InstallStepList';

export type AppType = {
  start(): Promise<void>;
}

export type CLIMgrType = {
  projectName: string;
  installType: InstallerTypes;
  installRepository: string;
};

export type LoggerType = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  error(...str: any[]): void;
  debug(...reason: any[]): void;
  /* eslint-enable */
}

export type InstallerType = {
  init(): void;
  install(): Promise<void>;
}

export type InstallStepType = {
  message: string;
  cmd: string | undefined;
  fn: (() => Promise<void>) | undefined;
  previous: InstallStep | undefined;
  next: InstallStep | undefined;
}

export type InstallStepListType = {
  last: InstallStep | undefined;
  add(stepOptions: InstallStepOptions): InstallStepList;
}
