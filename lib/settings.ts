import type * as i from 'types';
import { Low, JSONFile } from 'lowdb';

import { SETTINGS_FILE_PATH } from './constants';
import { logger } from './utils';

type Settings = {
  tracking?: i.Tracking;
  trackingName?: string;
};

export class Jsondb {
  private readonly db = new Low<Settings>(new JSONFile(SETTINGS_FILE_PATH));

  private async init() {
    await this.db.read();

    // Defaults
    this.db.data = this.db.data || {};
  }

  async getSetting<K extends keyof Settings>(key: K): Promise<Settings[K]> {
    try {
      if (this.db.data == null) {
        await this.init();
      }

      return this.db.data?.[key];
    } catch (e) {
      logger.error(
        'Something went wrong reading from the CRP settings.',
        JSON.stringify(e),
      );
    }
  }

  async setSetting<K extends keyof Settings, V extends Settings[K]>(
    key: K,
    value: V,
  ): Promise<void> {
    try {
      if (this.db.data != null) {
        this.db.data[key] = value;
      }
      await this.db.write();
    } catch (e) {
      logger.error(
        'Something went wrong updating the CRP settings.',
        JSON.stringify(e),
      );
    }
  }
}

export const settings = new Jsondb();
