import ora from 'ora';

import { LOG_PREFIX } from './constants';
import logger from './Logger';


/** @TODO */
export function getBoilerplates(): string[] {
  // fs.readdirSync();

  return ['react-web', 'react-mobile'];
}

export function createSpinner<Action extends ActionFn>(
  text: SpinnerText,
  action: Action,
): CreateSpinner {
  const spinner = ora(text.start);
  spinner.color = 'yellow';
  spinner.prefixText = LOG_PREFIX;

  async function start() {
    try {
      await action();
      spinner.succeed(text.success);
    } catch (err) {
      spinner.fail(text.fail);
      logger.error(err);
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
