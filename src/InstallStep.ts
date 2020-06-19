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

  get message(): string {
    return this._message;
  }

  get cmd(): string | undefined {
    return this._options.cmd;
  }

  get fn(): (() => Promise<void>) | undefined {
    return this._options.fn;
  }

  get previous(): InstallStep | undefined {
    return this._previous;
  }

  get next(): InstallStep | undefined {
    return this._next;
  }
}
