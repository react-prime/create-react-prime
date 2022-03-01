import { installersMap, state, cli } from '@crp';
import { logger } from '@crp/utils';
import { ERROR_TEXT, CLI_ARGS } from '@crp/constants';

import * as question from 'modules/questions';


export default async function installerEntry(): Promise<void> {
  // Prompt questions
  state.answers.boilerplate = await question.boilerplate();
  state.answers.projectName = cli.args[CLI_ARGS.ProjectName] || await question.projectName(state.answers.boilerplate);

  // Trigger installer for given answer
  const { boilerplate } = state.answers;

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
