import fs from 'fs';
import { logger, state } from '@crp';

import * as question from 'src/modules/questions';
import * as actions from 'src/modules/installers/shared/actions';

export async function modulesEntry(): Promise<void> {
  if (!fs.existsSync('src')) {
    logger.error(
      // eslint-disable-next-line quotes
      "No 'src' folder found. Please run this command from the root of your project.",
    );
  }

  // Important to detect the boilerplate so that scripts know what folder structure to take
  // into account
  state.answers.boilerplate = fs.existsSync('ios')
    ? 'react-mobile'
    : 'react-web';

  // Set project to be current folder
  state.answers.projectName = '.';

  state.answers.modules = await question.modules();
  if (state.answers.modules.length === 0) {
    process.exit();
  }

  logger.whitespace();

  await actions.installModules();
  await actions.npmInstall();
  await actions.removeMonorepo();
}
