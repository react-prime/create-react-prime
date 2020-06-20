import * as i from 'types';

export default class InstallStep implements i.InstallStepType {
  private _message = '';

  constructor(
    private _options: i.InstallStepOptions,
    private _previous?: InstallStep,
    private _next?: InstallStep,
  ) {
    this._message = `${_options.emoji}  ${_options.message}`;

    if (_previous) {
      _previous._next = this;
    }
  }


  get options(): i.InstallStepOptions {
    return this._options;
  }

  get id(): symbol {
    return this._options.id;
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
