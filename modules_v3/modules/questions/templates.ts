import { prompt, type DistinctQuestion, type CheckboxQuestion, type ListQuestion } from 'inquirer';


export async function question<Q extends DistinctQuestion>(obj: Q): Promise<string> {
  const answer = await prompt(obj);
  const { name } = obj;

  return answer[name];
}

export async function checkboxQuestion<
  R extends Record<string, unknown>[] | string[] | null = string[],
  Q extends Omit<CheckboxQuestion, 'type'> = Omit<CheckboxQuestion, 'type'>,
>(obj: Q): Promise<R> {
  const options: CheckboxQuestion = {
    ...obj,
    type: 'checkbox',
  };
  const answer = await prompt(options);
  const { name } = options;

  return answer[name];
}

export async function listQuestion<
  R extends Record<string, unknown> | string | null = string,
  Q extends Omit<ListQuestion, 'type'> = Omit<ListQuestion, 'type'>,
>(obj: Q): Promise<R> {
  const options: ListQuestion = {
    ...obj,
    type: 'list',
  };
  const answer = await prompt(options);
  const { name } = options;

  return answer[name];
}
