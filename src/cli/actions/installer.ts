import path from 'path';
import color from 'kleur';
import camelcase from 'camelcase';
import { state, cli, logger } from '@crp';
import { ERROR_TEXT } from '@crp/constants';

import * as installers from 'src/modules/installers';
import * as question from 'src/modules/questions';
import { npmInstructions } from 'installers/shared/instructions';

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
      throw new Error(ERROR_TEXT.InstallerNotFound.replace('%s', boilerplate));
    }

    await installer();

    showSuccessText();
  } catch (err) {
    if (err) {
      await logger.error(err);
    } else {
      await logger.error(ERROR_TEXT.GenericError, boilerplate);
    }
  }
}

function showSuccessText(): void {
  const { projectName, boilerplate } = state.answers;

  const projectPath = path.resolve(projectName);
  const styledProjectName = color.yellow().bold(projectName);
  const styledRepoName = color.dim(`(${boilerplate})`);
  const styledProjectPath = color.cyan(projectPath);

  function formatText(cmd: string, desc: string): string {
    return `  ${cmd.padEnd(17)} ${color.dim(desc)}`;
  }

  logger.whitespace();
  logger.msg(
    `${styledProjectName} ${styledRepoName} was succesfully installed at ${styledProjectPath}`,
  );
  logger.whitespace();
  logger.msg(`${color.bold().underline('Quickstart')}`);
  logger.whitespace();

  console.info(`  cd ${projectName}`);

  for (const str of npmInstructions.quickstart) {
    console.info(`  ${str}`);
  }

  logger.whitespace();
  logger.msg(`${color.bold().underline('All commands')}`);
  logger.whitespace();

  for (const str of npmInstructions.allCommands) {
    console.info(formatText(str.cmd, str.desc));
  }
}
