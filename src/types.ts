import { REPOSITORIES } from './constants';

export type InstallerTypes = keyof typeof REPOSITORIES;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodePackage = Record<string, any>;
