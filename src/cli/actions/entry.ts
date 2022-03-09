import gitUserName from 'git-user-name';
import { logger, settings, state, type cli } from '@crp';

import { createOperation } from 'src/db';
import * as question from '../../modules/questions';
import { installerEntry } from './installer';

type Options = ReturnType<typeof cli.opts>;
type Entries = {
  [key in NonNullable<keyof Options>]?: () => Promise<void>;
};

export async function entry(options: Options): Promise<() => Promise<void>> {
  await initTracking(options);
  return getActionForOption(options);
}

async function initTracking(options: Options): Promise<void> {
  const trackingSetting = await settings.getSetting('tracking');

  if (trackingSetting == null || options.tracking) {
    const tracking = await question.tracking();
    await settings.setSetting('tracking', tracking);

    let name = 'Anonymous';
    switch (tracking) {
      case 'choose':
        name = await question.trackingName();
        break;
      case 'git':
        name = gitUserName()!;
        break;
      case 'anonymous':
        name = 'Anonymous';
        break;
    }

    await settings.setSetting('trackingName', name);

    logger.msg(
      `Tracking enabled and set as '${name}'. To change, run: 'npx create-react-prime --tracking'`,
    );
    logger.whitespace();
  }

  // Start tracking
  await createOperation();
}

export async function getActionForOption(
  options: Options,
): Promise<() => Promise<void>> {
  const entries: Entries = {
    boilerplate: installerEntry,
  };

  // Lookup entry point for given CLI option
  let key: keyof Options;
  for (key in options) {
    const entry = entries[key];

    if (entry != null) {
      return entry;
    }
  }

  // No entry found, ask for entry
  state.answers.entry = await question.entry();
  const { entry } = state.answers;

  // User chose Exit
  if (entry == null) {
    process.exit();
  }

  // Get action with user's answer
  return getActionForOption({ [entry]: true });
}
