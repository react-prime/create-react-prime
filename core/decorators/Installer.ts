import * as i from 'types';


export default function Installer(options: i.InstallerOptions): <T extends i.Newable>(constructor: T) => T {
  const { questions, steps, ...opts } = options;

  return function<T extends i.Newable> (constructor: T): T {
    return class extends constructor {
      options = opts;
      steps = steps;
      questions = questions;
    };
  };
}
