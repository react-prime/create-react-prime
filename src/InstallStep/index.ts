export default class InstallStep {
  private _message = '';

  constructor(
    private args: InstallStepArgs,
  ) {
    this._message = `${args.emoji}  ${args.message}`;
  }

  get message(): string {
    return this._message;
  }

  get cmd(): string | undefined {
    return this.args.cmd;
  }

  get fn(): (() => Promise<void>) | undefined {
    return this.args.fn;
  }
}

export type InstallStepArgs = {
  /** Unique identifier for this step. */
  id: symbol;
  emoji: string;
  message: string;
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
