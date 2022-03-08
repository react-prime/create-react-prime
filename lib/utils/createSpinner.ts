import ora, { type Ora } from 'ora';
import { logger } from '@crp';
import { ERROR_TEXT, LOG_PREFIX } from '@crp/constants';
import { logAction } from '@crp/db';

export function createSpinner<Action extends ActionFn>(
  action: Action,
  text: SpinnerText,
  disableTracking = false,
): CreateSpinner {
  const spinner = ora(text.start);
  spinner.color = 'yellow';
  spinner.prefixText = LOG_PREFIX;

  async function start() {
    spinner.start();

    try {
      await action();
      spinner.succeed(text.success);

      if (!disableTracking) {
        logAction('action:' + text.name, '', { success: true });
      }
    } catch (err) {
      spinner.fail(text.fail);

      logAction('action:' + text.name, {
        success: false,
        error: JSON.stringify(err),
      });

      logger.whitespace();
      logger.error(ERROR_TEXT.GenericError, err);
    }
  }

  return {
    spinner,
    start,
  };
}

type SpinnerText = {
  name: string;
  start: string;
  success: string;
  fail: string;
};

type ActionFn = (...args: unknown[]) => Promise<unknown>;

export type CreateSpinner = {
  spinner: Ora;
  start: () => Promise<void>;
};
