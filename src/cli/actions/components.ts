import fs from 'fs';
import { logger, state } from '@crp';

import * as question from 'src/modules/questions';
import * as actions from 'src/modules/installers/shared/actions';
import { installComponents as webInstallComponents } from 'src/modules/installers/react-web/actions';
import { installComponents as mobileInstallComponents } from 'src/modules/installers/react-mobile/actions';

export async function componentsEntry(): Promise<void> {
  if (!fs.existsSync('src')) {
    logger.error(
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

  state.answers.components = await question.components();
  if (state.answers.components.length === 0) {
    process.exit();
  }

  logger.whitespace();

  switch (state.answers.boilerplate) {
    case 'react-web':
      await webInstallComponents();
      break;
    case 'react-mobile':
      await mobileInstallComponents();
      break;
  }

  await actions.npmInstall();
  await actions.removeMonorepo();
}
