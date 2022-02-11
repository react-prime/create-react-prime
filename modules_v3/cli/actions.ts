import camelcase from 'camelcase';

import * as question from '../modules/questions';
import cli, { ARGS } from '../cli';
import { getInstallers } from '../lib/utils';
import * as installers from '../modules/installers';
import logger from '../lib/logger';
import state from '../lib/state';


type InstallersMap = Map<string, () => Promise<void>>;

const installersMap: InstallersMap = (() => {
  const map: InstallersMap = new Map();

  for (const boilerplate of getInstallers()) {
    const exportName = `${camelcase(boilerplate)}Installer`;
    map.set(boilerplate, installers[exportName]?.default); // eslint-disable-line import/namespace
  }

  return map;
})();

export async function installerEntry(): Promise<void> {
  // Only run installer if this is explicitely what the user wants
  // Other flags should not trigger the installation process
  if (!cli.opts().boilerplate && Object.keys(cli.opts()).length > 0) {
    return;
  }

  state.answers.boilerplate = cli.opts().boilerplate || await question.boilerplate();
  state.answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(state.answers.boilerplate);

  const { boilerplate, projectName } = state.answers;
  if (!boilerplate || !projectName) {
    logger.error('No boilerplate or project name found!', boilerplate, projectName);
  }

  try {
    const installer = installersMap.get(boilerplate);
    await installer();
  } catch (err) {
    logger.error(`Unable to find installer for the selected boilerplate '${boilerplate}'!\n`, err);
  }
}
