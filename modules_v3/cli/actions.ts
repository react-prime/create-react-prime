import camelcase from 'camelcase';

import * as question from '../questions';
import cli, { ARGS } from '../cli';
import { getBoilerplates } from '../utils';
import * as installers from '../installers';
import logger from '../Logger';
import prompt from '../questions/prompt';


type InstallersMap = Map<string, () => Promise<void>>;

const installersMap: InstallersMap = (() => {
  const map: InstallersMap = new Map();

  for (const boilerplate of getBoilerplates()) {
    const exportName = `${camelcase(boilerplate)}Installer`;
    map.set(boilerplate, installers[exportName]?.default); // eslint-disable-line import/namespace
  }

  return map;
})();

export async function installBoilerplate(): Promise<void> {
  // Only run installer if this is explicitely what the user wants
  // Other flags should not trigger the installation process
  if (!cli.opts().boilerplate && Object.keys(cli.opts()).length > 0) {
    return;
  }

  let answers = await prompt('boilerplate', cli.opts().boilerplate || question.boilerplate);
  answers = await prompt(
    'projectName',
    cli.args[ARGS.ProjectName] || (() => question.projectName(answers.boilerplate)),
  );

  if (!answers.boilerplate || !answers.projectName) {
    logger.error('No boilerplate or project name found!', answers.boilerplate, answers.projectName);
  }

  try {
    const installer = installersMap.get(answers.boilerplate);
    await installer();
  } catch (err) {
    logger.error(`Unable to find installer for the selected boilerplate '${answers?.boilerplate}'!\n`, err);
  }
}
