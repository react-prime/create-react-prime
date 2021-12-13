import * as i from 'types';
import { JsonPrimitive } from 'type-fest';


export default function Option<Value extends JsonPrimitive>(options: i.CLIOptionOptions<Value>) {
  return function<T extends i.Newable<OptionConstructor<Value>>> (constructor: T): T {
    return class extends constructor {
      flags = options.flags;
      description = options.description || '';
      defaultValue = options.defaultValue || undefined;
      terminate = options.terminate;

      getName(): string | undefined {
        return this.flags.match(/--(\w+)/)?.[1];
      }
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface OptionConstructor<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on?(flags?: i.Opts, options?: Record<string, any>): void;
}
