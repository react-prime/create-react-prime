export default class InstallStep {
  private _message = '';
  private _next?: InstallStep;

  constructor(
    private _options: InstallStepOptions,
    private _previous?: InstallStep,
  ) {
    if (!_options.cmd && !_options.fn) {
      throw new Error('Every install step is required to have either "cmd" or "fn".');
    }

    this._message = `${_options.emoji}  ${_options.message}`;

    if (_previous) {
      _previous._next = this;
    }
  }


  get options(): InstallStepOptions {
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

export type InstallStepOptions = {
  /** Unique identifier for this step. */
  id: symbol;
  /** Message displayed when this step is being executed. */
  message: string;
  /** Emoji displayed between spinner and message. */
  emoji: string;
  /** Used for command line scripts. */
  cmd?: string;
  /**
   * Used for anything that should be executed with JavaScript,
   * or is easier to translate into JavaScript rather than a command line script.
   * Can be used together with a command line script from `cmd`. This function will always run
   * after the command line script is finished executing.
   */
  fn?: () => Promise<void>;
}
