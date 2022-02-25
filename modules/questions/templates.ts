import type { SetRequired } from 'type-fest';
import type { DistinctQuestion, CheckboxQuestion, ListQuestion } from 'inquirer';
import { prompt } from 'inquirer';


export async function question<Q extends AugmentedDistinctQuestion>(obj: Q): Promise<string> {
  const answer = await prompt(obj);

  return answer[obj.name!];
}

export async function checkboxQuestion<
  R extends Record<string, unknown>[] | string[] | null = string[],
  Q extends AugmentedCheckboxQuestion = AugmentedCheckboxQuestion,
>(obj: Q): Promise<R> {
  const options: Q = {
    ...obj,
    type: 'checkbox',
  };
  const answer = await prompt(options);

  return answer[options.name!];
}

export async function listQuestion<
  R extends Record<string, unknown> | string | null = string,
  Q extends AugmentedListQuestion = AugmentedListQuestion,
>(obj: Q): Promise<R> {
  const options: Q = {
    ...obj,
    type: 'list',
  };
  const answer = await prompt(options);

  return answer[options.name!];
}

type AugmentedDistinctQuestion = SetRequired<DistinctQuestion, 'name'>;
type AugmentedCheckboxQuestion = Omit<SetRequired<CheckboxQuestion, 'name' | 'choices'>, 'type'>;
type AugmentedListQuestion = Omit<SetRequired<ListQuestion, 'name' | 'choices'>, 'type'>;
