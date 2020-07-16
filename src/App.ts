import fs from 'fs';
import * as i from 'types';
import { injectable, inject } from 'inversify';
import container from 'ioc';
import SERVICES from 'ioc/services';
import Text from 'utils/Text';


@injectable()
export default class App implements i.AppType {
  private installer!: i.InstallerType;
  private text = new Text();

  constructor(
    @inject(SERVICES.CLIMgr) private readonly cliMgr: i.CLIMgrType,
    @inject(SERVICES.Logger) private readonly logger: i.LoggerType,
  ) {
    this.logger.msg('create-react-prime v$version\n');
  }


  async install(): Promise<void> {
    const { projectName, installRepository, installType } = this.cliMgr;

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

    this.logger.msg(this.text.bold(`Succesfully installed ${installRepository}!\n`));
  }

  async form(type: 'pre' | 'post'): Promise<void> {
    const questions = container.getNamed<i.QuestionsType>(SERVICES.Questions, type);

    // Prompt questions for user
    const answers = await questions.ask();

    // Act upon the given answers
    await questions.answer(answers);

    // Add white space
    // eslint-disable-next-line no-console
    console.log();
  }
}
