import camelcase from 'camelcase';
import { crpJSON } from '@crp/generated';

import * as installers from 'modules/installers';

type InstallerModules = Record<string, { default: () => Promise<void> }>;
type InstallersMap = Map<string, () => Promise<void>>;


export const installersMap: InstallersMap = new Map();

for (const boilerplate of crpJSON.modules) {
  const exportName = `${camelcase(boilerplate)}Installer`;

  const installer = (installers as InstallerModules)[exportName]?.default;
  if (installer) {
    installersMap.set(boilerplate, installer);
  }
}
