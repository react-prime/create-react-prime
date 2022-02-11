import camelcase from 'camelcase';

import * as question from '../../modules/questions';
import cli, { ARGS } from '..';
import { getInstallers } from '../../lib/utils';
import * as installers from '../../modules/installers';
import logger from '../../lib/logger';
import state from '../../lib/state';
import { ERROR_TEXT } from '../../lib/constants';


type InstallersMap = Map<string, () => Promise<void>>;

const installersMap: InstallersMap = (() => {
  const map: InstallersMap = new Map();

  for (const boilerplate of getInstallers()) {
    const exportName = `${camelcase(boilerplate)}Installer`;
    map.set(boilerplate, installers[exportName]?.default); // eslint-disable-line import/namespace
  }

  return map;
})();

export default async function installerEntry(): Promise<void> {
  // Prompt questions
  state.answers.boilerplate = cli.opts().boilerplate || await question.boilerplate();
  state.answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(state.answers.boilerplate);

  const { boilerplate, projectName } = state.answers;
  if (!boilerplate || !projectName) {
    logger.error('No boilerplate or project name found!', boilerplate, projectName);
  }

  // Trigger installer for given answer
  try {
    const installer = installersMap.get(boilerplate);
    await installer();
  } catch (err) {
    logger.error(`${ERROR_TEXT.GenericError}\n`, boilerplate, err);
  }
}
