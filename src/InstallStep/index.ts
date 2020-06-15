export default class InstallStep {
  private _message = '';
  private _next?: InstallStep;

  constructor(
    private _args: InstallStepArgs,
    private _previous?: InstallStep,
  ) {
    if (!_args.cmd && !_args.fn) {
      throw new Error('Every install step is required to have either "cmd" or "fn".');
    }

    this._message = `${_args.emoji}  ${_args.message}`;

    if (_previous) {
      _previous._next = this;
    }
  }


  get args(): InstallStepArgs {
    return this._args;
  }

  get id(): symbol {
    return this._args.id;
  }

  get message(): string {
    return this._message;
  }

  get cmd(): string | undefined {
    return this._args.cmd;
  }

  get fn(): (() => Promise<void>) | undefined {
    return this._args.fn;
  }

  previous(): InstallStep | undefined {
    return this._previous;
  }

  next(): InstallStep | undefined {
    return this._next;
  }
}

export type InstallStepArgs = {
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
