import path from 'path';
import { Command } from 'commander';
import { Answers } from 'inquirer';

import * as utils from './utils';
import * as question from './questions';

const installers = {
  'react-web': require('./react-web/questions').default,
};
// import reactMobileQuestions from './react-mobile/questions';

type CLIOptions = {
  boilerplate?: string;
}

declare module 'commander' {
  export interface Command {
    opts(): CLIOptions;
    action(fn: (flags: CLIOptions) => void | Promise<void>): this;
  }
}

export const ARGS = {
  ProjectName: 0,
};

const cli = new Command();

// Set CLI version to package.json version
cli.version(process.env.VERSION!);

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

// Parse user input
cli.parse(process.argv);

export default cli;
