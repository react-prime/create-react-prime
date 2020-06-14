import { REPOSITORIES } from './constants';

export type InstallerTypes = keyof typeof REPOSITORIES;

export type Json = string | number | boolean | { [key: string]: Json } | Json[] | null;

export type PackageJson = {
  scripts?: Record<string, string>;
  repository?: {
    url: string;
    [key: string]: string;
  };
  [key: string]: Json | undefined;
}
