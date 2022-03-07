import path from 'path';
import color from 'kleur';
import { state, bootstrapCLI, closeApp } from '@crp';
import { logger } from '@crp/utils';

import { entry } from 'src/cli/actions/entry';
import { npmInstructions } from 'installers/shared/instructions';

async function main() {
  // Show startup text
  start();

  // Parse CLI arguments
  const cli = await bootstrapCLI();

  // Find and run entry point for given CLI option
  const action = await entry(cli.opts());
  await action();

  // Show closing text
  close();

  // Exit application
  await closeApp();
}

export function start(): void {
  const packageName = color.yellow().bold(process.env.NAME);
  const version = process.env.VERSION;

  logger.msg(`${packageName} v${version} ${color.dim('(ctrl + c to exit)')}`);
  logger.whitespace();
}

export function close(): void {
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

main();
