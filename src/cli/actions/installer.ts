import camelcase from 'camelcase';
import { state, cli, logger } from '@crp';
import { ERROR_TEXT, CLI_ARGS } from '@crp/constants';

import * as installers from 'src/modules/installers';
import * as question from 'src/modules/questions';

export function getInstaller(
  boilerplate: string,
): () => Promise<void> | undefined {
  const installersMap = installers as Record<
    string,
    { default: () => Promise<void> }
  >;

  return installersMap[`${camelcase(boilerplate)}Installer`]?.default;
}

export async function installerEntry(): Promise<void> {
  // Prompt questions
  state.answers.boilerplate = await question.boilerplate();
  // prettier-ignore
  state.answers.projectName = cli.args[CLI_ARGS.ProjectName] || (await question.projectName(state.answers.boilerplate));

  // Trigger installer for given answer
  const { boilerplate } = state.answers;

  try {
    const installer = getInstaller(boilerplate);

    if (typeof installer !== 'function') {
      throw ERROR_TEXT.InstallerNotFound;
    }

    await installer();
  } catch (err) {
    if (err) {
      logger.error(err, boilerplate);
    } else {
      logger.error(ERROR_TEXT.GenericError, boilerplate);
    }
  }
}
