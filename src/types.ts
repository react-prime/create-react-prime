import boilerplateConfig from './boilerplateConfig.json';

export type BoilerplateConfig = {
  owner: string;
  boilerplateData: {
    name: string;
  };
  projectName: string;
}

export type BoilerplateConfigTypes = Exclude<keyof typeof boilerplateConfig, 'owner'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodePackage = Record<string, any>;
