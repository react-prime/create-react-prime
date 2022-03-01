import { state } from '@crp';
import type cli from 'cli';
import * as questions from 'modules/questions';

import installerEntry from './installer';


export async function getAction(options?: ReturnType<typeof cli.opts>): Promise<() => Promise<void>> {
  if (options) {
    // Boilerplate installer entry
    if (options.boilerplate) {
      return installerEntry;
    }
  }

  // No options found, ask for entry
  state.answers.entry = await questions.entry();
  const { entry } = state.answers;

  if (entry == null) {
    process.exit();
  }

  // Get action with user's answer
  return getAction({ [entry]: true });
}
