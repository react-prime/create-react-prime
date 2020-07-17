import fs from 'fs';
import path from 'path';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import container from 'ioc';
import SERVICES from 'ioc/services';


@injectable()
export default class App implements i.AppType {
  private installer!: i.InstallerType;

  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) private readonly logger: i.LoggerType,
  ) {}


  async install(): Promise<void> {
    const { projectName, installType } = this.cliMgr;

    // Get installer for the type that was specified by the user
    this.installer = container.getNamed(SERVICES.Installer, installType!);

    // Prepare installer environment
    this.installer.init();

    // Check if directory already exists to prevent overwriting existing data
    if (fs.existsSync(projectName!)) {
      this.logger.error(`directory '${projectName}' already exists.`);
    }

    // Start the installation process
    try {
      await this.installer.install();
    } catch (err) {
      this.logger.error(err);
    }

    this.logger.whitespace();
  }

  async form(type: 'pre' | 'post'): Promise<void> {
    const questions = container.getNamed<i.QuestionsType>(SERVICES.Questions, type);

    // Prompt questions for user
    const answers = await questions.ask();

    // Act upon the given answers
    await questions.answer(answers);

    if (Object.keys(answers).length > 0) {
      this.logger.whitespace();
    }
  }

  end(): void {
    const { projectName, installRepository } = this.cliMgr;
    const projectPath = path.resolve(this.cliMgr.projectName!);

    this.logger.msg(`'${projectName}' (${installRepository}) was succesfully installed at ${projectPath}.`);
  }
}
