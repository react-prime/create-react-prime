import type { Command } from 'commander';
import { Answers } from 'inquirer';

import * as utils from '../utils';
import * as question from '../questions';


const installers: Record<string, (answers: Answers) => Promise<void>> = {
  'react-web': require('../react-web/questions').default,
};

export const ARGS = {
  ProjectName: 0,
};

function addOptions(cli: Command): void {
  cli
    .option('-b, --boilerplate <boilerplate>')
    .description(`Install chosen boilerplate. Options: ${utils.getBoilerplates()}`)
    .action(async (flags) => {
      if (flags.boilerplate || Object.keys(flags).length === 0) {
        const answers: Answers = {};

        answers.boilerplate = cli.opts().boilerplate || await question.boilerplate();
        answers.projectName = cli.args[ARGS.ProjectName] || await question.projectName(answers);

        const installer = installers[answers.boilerplate];
        await installer(answers);
      }
    });
}

export default addOptions;
