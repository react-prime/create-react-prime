import * as i from 'types';
import lowdb, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { SETTINGS_FILE_PATH } from 'core/constants';


class SettingsMgr {
  // System's CRP settings file
  private readonly settingsDB: LowdbSync<i.Settings> = lowdb(
    new FileSync(SETTINGS_FILE_PATH),
  );

  constructor() {
    this.settingsDB.defaults({
      labela: false,
    });
  }

  read = <T extends keyof i.Settings>(key: T): i.Settings[T] => {
    return this.settingsDB
      .get(key)
      .value();
  }

  write = <T extends keyof i.Settings, R extends i.Settings[T]>(key: T, value: R): R => {
    const db = this.settingsDB
      .set(key, value)
      .write<i.Settings>();

    // @ts-ignore This works. Write returns the full DB state as object.
    // Possible faulty types from Lowdb.
    return db[key];
  }
}

const settingsMgr = new SettingsMgr();

export default settingsMgr;
