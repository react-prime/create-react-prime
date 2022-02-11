import type { OptionValues } from 'commander';

import installerEntry from './installer';


export default function actionsEntry(options: OptionValues): () => Promise<unknown> {
  // Boilerplate installer entry
  if (options.boilerplate || Object.keys(options).length === 0) {
    return installerEntry;
  }
}
