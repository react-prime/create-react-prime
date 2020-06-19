import { InstallStepType } from './ioc';
import { InstallStepOptions } from './types';

export default class InstallStep implements InstallStepType {
  private _message = '';

  constructor(
    private _options: InstallStepOptions,
    private _previous?: InstallStep,
    private _next?: InstallStep,
  ) {
    this._message = `${_options.emoji}  ${_options.message}`;

    if (_previous) {
      _previous._next = this;
    }
  }
}
