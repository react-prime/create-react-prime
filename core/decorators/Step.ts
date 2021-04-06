import * as i from 'types';
import ora from 'ora';

import Logger from 'core/Logger';
import { LOG_PREFIX } from 'core/constants';


export default function Step(options: i.StepOptions) {
  return function<T extends i.Newable<StepConstructor>> (constructor: T): T {
    return class extends constructor {
      name = options.name;
      after = options.after;

      async on(args: i.InstallStepArgs) {
        const logger = new Logger();
        const { emoji, message } = options.spinner;

        const spinner = ora(`${emoji}  ${message.pending()}`);
        spinner.color = 'yellow';
        spinner.prefixText = LOG_PREFIX;
        spinner.start();

        try {
          await super.on(args);
          spinner.succeed(`${emoji}  ${message.success()}`);
        } catch (err) {
          spinner.fail();
          logger.error(err);
        }
      }
    };
  };
}

interface StepConstructor {
  on(args: i.InstallStepArgs): void | Promise<void>;
}
