import camelcase from 'camelcase';
import { state } from '@crp';
import { logger } from '@crp/utils';
import { runtimeJSON } from '@crp/generated';
import { ERROR_TEXT } from '@crp/constants';

import cli, { ARGS } from 'cli';
import * as question from 'modules/questions';
import * as installers from 'modules/installers';


type InstallersMap = Record<string, () => Promise<void>>;

const installersMap: InstallersMap = (() => {
  const map: InstallersMap = {};

  for (const boilerplate of runtimeJSON.modules) {
    const exportName = `${camelcase(boilerplate)}Installer`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map[boilerplate] = (installers as Record<string, any>)[exportName]?.default;
  }

  return map;
})();

export default async function installerEntry(): Promise<void> {
  // Prompt questions
  state.answers.boilerplate = cli.opts().boilerplate || await question.boilerplate();
  state.answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(state.answers.boilerplate);

  const { boilerplate } = state.answers;

  // Trigger installer for given answer
  try {
    const installer = installersMap[boilerplate];
    await installer();
  } catch (err) {
    logger.error(`${ERROR_TEXT.GenericError}\n`, boilerplate, err);
  }
}
