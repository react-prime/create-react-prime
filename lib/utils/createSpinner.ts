import ora from 'ora';

import { LOG_PREFIX } from '@crp/constants';
import logger from '@crp/logger';


export function createSpinner<Action extends ActionFn>(
  action: Action,
  text: SpinnerText,
): CreateSpinner {
  const spinner = ora(text.start);
  spinner.color = 'yellow';
  spinner.prefixText = LOG_PREFIX;

  async function start() {
    spinner.start();

    try {
      await action();
      spinner.succeed(text.success);
    } catch (err) {
      spinner.fail(text.fail);
      logger.whitespace();
      logger.error('Something went wrong during the installation process.\n', err);
    }
  }

  return {
    spinner,
    start,
  };
}

type SpinnerText = {
  start: string;
  success: string;
  fail: string;
};

type ActionFn = (...args: unknown[]) => Promise<unknown>;

type CreateSpinner = {
  spinner: ora.Ora;
  start: () => Promise<void>;
};
