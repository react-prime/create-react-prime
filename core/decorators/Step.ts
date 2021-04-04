import * as i from 'types';
import ora from 'ora';

import Logger from 'core/Logger';
import { LOG_PREFIX } from 'core/constants';


function Step(options: StepOptions) {
  return function<T extends i.Newable> (constructor: T): T {
    return class extends constructor {
      name = options.name;
      after = options.after;

      async on() {
        const logger = new Logger();
        const { emoji, message } = options.spinner;

        const spinner = ora(`${emoji}  ${message.pending()}`);
        spinner.prefixText = LOG_PREFIX;
        spinner.start();

        try {
          await super.on();
          spinner.succeed(`${emoji}  ${message.success()}`);
        } catch (err) {
          spinner.fail();
          logger.error(err);
        }
      }
    };
  };
}

interface StepOptions {
  name: string;
  after?: string;
  spinner: i.SpinnerOptions;
}

export default Step;
