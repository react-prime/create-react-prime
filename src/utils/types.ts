import * as i from 'types';

export type PackageJson = {
  scripts?: Record<string, string>;
  repository?: {
    url: string;
    [key: string]: string;
  };
  [key: string]: i.Json | undefined;
}
