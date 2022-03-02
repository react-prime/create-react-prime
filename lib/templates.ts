import type { SetRequired } from 'type-fest';
import type { DistinctQuestion, CheckboxQuestion, ListQuestion } from 'inquirer';
import inquirer from 'inquirer';
import { logAction } from '@crp/db';


export async function question<Q extends AugmentedDistinctQuestion>(obj: Q): Promise<string> {
  const answer = await inquirer.prompt(obj);
  const value = answer[obj.name!];

  logAction('question:' + obj.name!, value, { success: true });

  return value;
}

export async function checkboxQuestion<
  R extends Record<string, unknown>[] | string[] | null = string[],
  Q extends AugmentedCheckboxQuestion = AugmentedCheckboxQuestion,
>(obj: Q): Promise<R> {
  const options: Q = {
    ...obj,
    type: 'checkbox',
  };
  const answer = await inquirer.prompt(options);
  const value = answer[obj.name!];

  logAction('question:' + obj.name!, value, { success: true });

  return value;
}

export async function listQuestion<
  R extends Record<string, unknown> | string | null = string,
  Q extends AugmentedListQuestion = AugmentedListQuestion,
>(obj: Q): Promise<R> {
  const options: Q = {
    ...obj,
    type: 'list',
  };
  const answer = await inquirer.prompt(options);
  const value = answer[obj.name!];

  logAction('question:' + obj.name!, value, { success: true });

  return value;
}

type AugmentedDistinctQuestion = SetRequired<DistinctQuestion, 'name'>;
type AugmentedCheckboxQuestion = Omit<SetRequired<CheckboxQuestion, 'name' | 'choices'>, 'type'>;
type AugmentedListQuestion = Omit<SetRequired<ListQuestion, 'name' | 'choices'>, 'type'>;
