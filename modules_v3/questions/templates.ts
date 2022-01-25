import { prompt, type DistinctQuestion, type CheckboxQuestion, type ListQuestion } from 'inquirer';


export async function question<Q extends DistinctQuestion>(obj: Q): Promise<string> {
  const answer = await prompt(obj);
  const { name } = obj;

  return answer[name];
}

export async function checkboxQuestion<Q extends Omit<CheckboxQuestion, 'type'>>(obj: Q): Promise<string[]> {
  const options: CheckboxQuestion = {
    ...obj,
    type: 'checkbox',
  };
  const answer = await prompt(options);
  const { name } = options;

  return answer[name];
}

export async function listQuestion<Q extends Omit<ListQuestion, 'type'>>(obj: Q): Promise<string | null> {
  const options: ListQuestion = {
    ...obj,
    type: 'list',
  };
  const answer = await prompt(options);
  const { name } = options;

  return answer[name];
}
