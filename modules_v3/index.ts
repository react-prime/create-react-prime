import path from 'path';
import color from 'kleur';

import logger from './Logger';
import { bootstrap as bootstrapCLI } from './cli';
import * as actions from './cli/actions';
import instructions from './installers/instructions';
import state from './state';

async function main() {
  start();
  await bootstrapCLI();

  // Start CLI actions
  for await (const action of Object.values(actions)) {
    await action();
  }

  close();
  process.exit();
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
  logger.msg(`${styledProjectName} ${styledRepoName} was succesfully installed at ${styledProjectPath}`);
  logger.whitespace();
  logger.msg(`${color.bold().underline('Quickstart')}`);
  logger.whitespace();

  console.info(`  cd ${projectName}`);

  for (const str of instructions.quickstart) {
    console.info(`  ${str}`);
  }

  logger.whitespace();
  logger.msg(`${color.bold().underline('All commands')}`);
  logger.whitespace();

  for (const str of instructions.allCommands) {
    console.info(formatText(str.cmd, str.desc));
  }
}

main();
