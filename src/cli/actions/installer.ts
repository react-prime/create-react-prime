import camelcase from 'camelcase';
import { state, cli, logger } from '@crp';
import { ERROR_TEXT } from '@crp/constants';

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

  const { boilerplate } = state.answers;
  const nameFromCli = cli.getArg('ProjectName');
  state.answers.projectName =
    nameFromCli || (await question.projectName(boilerplate));

  // Trigger installer for given answer
  try {
    const installer = getInstaller(boilerplate);

    if (typeof installer !== 'function') {
      throw ERROR_TEXT.InstallerNotFound;
    }

    await installer();
  } catch (err) {
    if (err) {
      await logger.error(err, boilerplate);
    } else {
      await logger.error(ERROR_TEXT.GenericError, boilerplate);
    }
  }
}
