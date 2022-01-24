import { prompt, type DistinctQuestion, type CheckboxQuestion, type ListQuestion } from 'inquirer';


export const question = async <Q extends DistinctQuestion>(obj: Q): Promise<string> => {
  const answers = await prompt([obj]);
  const { name } = obj;

  return answers[name];
};

export const checkboxQuestion = async <Q extends Omit<CheckboxQuestion, 'type'>>(obj: Q): Promise<string[]> => {
  const options: CheckboxQuestion = {
    ...obj,
    type: 'checkbox',
  };
  const answers = await prompt([options]);
  const { name } = options;

  return answers[name];
};

export const listQuestion = async <Q extends Omit<ListQuestion, 'type'>>(obj: Q): Promise<string | null> => {
  const options: ListQuestion = {
    ...obj,
    type: 'list',
  };
  const answers = await prompt([options]);
  const { name } = options;

  return answers[name];
};
