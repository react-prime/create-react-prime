import * as i from 'types';

export default class InstallStep implements i.InstallStepType {
  private _message = {} as i.InstallMessage;

  constructor(
    private _options: i.InstallStepOptions,
    private _previous?: InstallStep,
    private _next?: InstallStep,
  ) {
    // Combine emoji with every status message
    let status: keyof i.InstallMessage;
    for (status in _options.message) {
      this._message[status] = `${_options.emoji}  ${_options.message[status]}`;
    }

    if (_previous) {
      _previous._next = this;
    }
  }


  get options(): i.InstallStepOptions {
    return this._options;
  }

  get id(): i.InstallStepIds {
    return this._options.id;
  }

  get message(): i.InstallMessage {
    return this._message;
  }

  get cmd(): string | undefined {
    return this._options.cmd;
  }

  get fn(): (() => Promise<void>) | undefined {
    /** @TODO Fix types */
    // @ts-ignore
    return this.options.fn;
  }

  get previous(): InstallStep | undefined {
    return this._previous;
  }

  get next(): InstallStep | undefined {
    return this._next;
  }
}
