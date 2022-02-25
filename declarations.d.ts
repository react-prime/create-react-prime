declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NAME: string;
      VERSION: string;
    }
  }
}

export type CLIOptions = {
  boilerplate?: string;
};

declare module 'commander' {
  export interface Command {
    opts(): CLIOptions;
    action(fn: (flags: CLIOptions) => void | Promise<void>): this;
  }
}
