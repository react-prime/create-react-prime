import { state, type cli } from '@crp';

import * as question from '../../modules/questions';
import { installerEntry } from './installer';


type Options = ReturnType<typeof cli.opts>;
type Entries = {
  [key in NonNullable<keyof Options>]?: () => Promise<void>;
};

export async function getActionForOption(options: Options): Promise<() => Promise<void>> {
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
