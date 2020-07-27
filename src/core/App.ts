import fs from 'fs';
import path from 'path';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import color from 'kleur';

import container from 'core/ioc/container';
import SERVICES from 'core/ioc/services';
import { Answers } from 'inquirer';
import { ERROR_TEXT } from './constants';
import getIocTargetName from './utils/GetIocTargetName';


@injectable()
export default class App implements i.AppType {
  private installer!: i.InstallerType;

  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) private readonly logger: i.LoggerType,
  ) {}


  async install(): Promise<void> {
    const { installType } = this.cliMgr;

    // Get installer for the type that was specified by the user
    this.installer = container.getNamed(SERVICES.Installer, installType!);

    // Prepare installer environment
    this.installer.init();

    // Check if directory already exists to prevent overwriting existing data
    const { projectName } = this.cliMgr;

    if (fs.existsSync(projectName!)) {
      this.logger.error(ERROR_TEXT.DirectoryExists, projectName);
    }

    // Start the installation process
    try {
      await this.installer.install();
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.whitespace();
  }

  async prompt(when: i.PromptWhen): Promise<void> {
    const { installationLangConfig, installationConfig, lang, installType } = this.cliMgr;
    let answers: Answers;

    // Default questions
    let promptName = getIocTargetName.prompt();

    answers = await this.doPrompt(when, promptName);

    // Language specific questions
    if (installationLangConfig.prompt) {
      promptName = getIocTargetName.prompt(lang);

      answers = await this.doPrompt(when, promptName);
    }

    // Install specific questions
    if (installationConfig?.prompt) {
      promptName = getIocTargetName.prompt(lang, installType);

      answers = await this.doPrompt(when, promptName);
    }

    if (Object.keys(answers).length > 0) {
      this.logger.whitespace();
    }
  }

  end(): void {
    const { installationConfig, installationLangConfig } = this.cliMgr;
    const projectPath = path.resolve(this.cliMgr.projectName!);
    const styledProjectName = color.yellow().bold(this.cliMgr.projectName!);
    const styledRepoName = color.dim(`(${installationConfig?.repository})`);

    this.logger.msg(`${styledProjectName} ${styledRepoName} was succesfully installed at ${color.cyan(projectPath)}\n`);

    function formatText(cmd: string, desc: string): string {
      return `  ${cmd.padEnd(17)} ${color.dim(desc)}`;
    }

    /* eslint-disable no-console */
    this.logger.msg(`${color.bold().underline('Quickstart')}\n`);

    console.log(`  cd ${this.cliMgr.projectName}`);

    const qs = installationConfig?.instructions?.quickstart || installationLangConfig.instructions.quickstart;

    for (const str of qs) {
      console.log(`  ${str}`);
    }

    const ac = installationConfig?.instructions?.allCommands || installationLangConfig.instructions.allCommands;

    if (ac) {
      this.logger.whitespace();

      this.logger.msg(`${color.bold().underline('All commands')}\n`);

      for (const str of ac) {
        console.log(formatText(str.cmd, str.desc));
      }
    }
    /* eslint-enable */
  }


  private async doPrompt(when: i.PromptWhen, iocTargetName: string): Promise<Answers> {
    const prompt = container.getNamed<i.PromptType>(SERVICES.Prompt, iocTargetName);

    // Prompt questions for user
    const answers = await prompt.ask(when);

    // Act upon the given answers
    await prompt.answer(when, answers);

    return answers;
  }
}
