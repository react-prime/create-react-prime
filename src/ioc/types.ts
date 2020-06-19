import { InstallerTypes, InstallStepOptions } from '../types';
import InstallStep from '../InstallStep';
import InstallStepList from '../InstallStepList';

export type AppType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(): Promise<void>;
}

export type CLIMgrType = {
  projectName: string;
  installType: InstallerTypes;
  installRepository: string;
};

export type LoggerType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...str: any[]): void;
}

export type InstallerType = {
  start(): Promise<void>;
}

// eslint-disable-next-line
export type InstallStepType = {}

export type InstallStepListType = {
  last: InstallStep | undefined;
  add(stepOptions: InstallStepOptions): InstallStepList;
}
