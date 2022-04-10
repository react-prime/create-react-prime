declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NAME: string;
      VERSION: string;
    }
  }
}

export type CLIOptions = {
  boilerplate?: boolean;
  modules?: boolean;
  debug?: boolean;
  tracking?: boolean;
};

declare module 'commander' {
  export interface Command {
    opts(): CLIOptions;
    action(fn: (flags: CLIOptions) => void | Promise<void>): this;
  }
}

// Merge package.json type with labela property type
declare module 'type-fest' {
  declare namespace PackageJson {
    interface PackageJsonStandard {
      labela: {
        boilerplate?: {
          name: string;
          version: string;
        };
        components?: string[];
      };
    }
  }
}
