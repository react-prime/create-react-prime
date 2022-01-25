import camelcase from 'camelcase';

import * as question from '../questions';
import cli, { ARGS } from '../cli';
import { getBoilerplates } from '../utils';
import * as installers from '../installers';
import state from '../state';
import logger from '../Logger';


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

  const answers = await state.set('answers', async (answers) => {
    answers.boilerplate = cli.opts().boilerplate || await question.boilerplate();
    answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(answers.boilerplate);
  });

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
