import * as i from 'types';


function Question(options: i.QuestionOptions) {
  return function<T extends i.Newable<QuestionClass>> (constructor: T): T {
    const question = new constructor();

    // Extract all props
    const methods: QuestionClassProps[] = [];
    const obj = Object.getPrototypeOf(question);
    const props = [
      ...Object.getOwnPropertyNames(obj),
      ...Object.keys(question),
    ] as QuestionClassProps[];

    // Add all valid methods to array
    for (const prop of props) {
      if (prop === 'constructor') {
        continue;
      }

      if (typeof question[prop] === 'function') {
        methods.push(prop);
      }
    }

    // Add methods to object so we can add them as options later
    const optionMethods = {} as Record<keyof QuestionClass, any>;
    for (const method of methods) {
      optionMethods[method] = question[method];
    }

    return class extends constructor {
      options = {
        ...options,
        ...optionMethods,
      };
    };
  };
}

interface QuestionClass {
  when?(): boolean;
  validate?(input: string): string | boolean;
}

type QuestionClassProps = keyof QuestionClass | 'constructor';

export default Question;
