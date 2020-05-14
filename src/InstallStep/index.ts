export default class InstallStep {
  private message = '';

  constructor(
    private args: InstallStepArgs,
  ) {
    this.message = `${args.emoji}  ${args.message}`;
  }

  get formattedMessage() {
    return this.message;
  }

  get time() {
    return this.args.time;
  }

  get cmd() {
    return this.args.cmd;
  }

  get fn() {
    return this.args.fn;
  }
}

export type InstallStepArgs = {
  /** @description Unique identifier for this step. */
  id: symbol;
  emoji: string;
  message: string;
  /** @description Estimated guess of how much time this step will take. In milliseconds. */
  time: number;
  /** @description Used for command line scripts. */
  cmd?: string;
  /**
   * @description Used for anything that should be executed with JavaScript,
   * or is easier to translate into JavaScript rather than a command line script.
   * Can be used together with a command line script from `cmd`. This function will always run
   * after the command line script is finished executing.
   */
  fn?: () => Promise<void>;
}
