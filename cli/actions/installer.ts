import { installersMap, state } from '@crp';
import { logger } from '@crp/utils';
import { ERROR_TEXT } from '@crp/constants';

import cli, { ARGS } from 'cli';
import * as question from 'modules/questions';


export default async function installerEntry(): Promise<void> {
  // Prompt questions
  state.answers.boilerplate = await question.boilerplate();
  state.answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(state.answers.boilerplate);

  const { boilerplate } = state.answers;

  // Trigger installer for given answer
  try {
    const installer = installersMap.get(boilerplate);

    if (!installer) {
      throw ERROR_TEXT.InstallerNotFound;
    }

    await installer();
  } catch (err) {
    if (err) {
      logger.error(err, boilerplate);
    } else {
      logger.error(`${ERROR_TEXT.GenericError}\n`, boilerplate);
    }
  }
}
