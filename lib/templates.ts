import type { SetRequired } from 'type-fest';
// prettier-ignore
import type { CheckboxQuestion, DistinctQuestion, ListQuestion } from 'inquirer';
import inquirer from 'inquirer';
import { state } from '@crp';
import { logAction } from '@crp/db';

export async function canAskQuestion(): Promise<void | true> {
  if (state.operation.result === 'error') {
    await new Promise((_, reject) => setTimeout(() => reject(false), 5000));
  }

  return true;
}

export async function question<Q extends AugmentedDistinctQuestion>(
  obj: Q,
): Promise<string> {
  await canAskQuestion();
  const answer = await inquirer.prompt(obj);
  const value = answer[obj.name!];

  if (!obj.disableTracking) {
    logAction('question:' + obj.name!, value, { success: true });
  }

  return value;
}

export async function checkboxQuestion<
  R extends Record<string, unknown>[] | string[] | null = string[],
  Q extends AugmentedCheckboxQuestion = AugmentedCheckboxQuestion,
>(obj: Q): Promise<R> {
  await canAskQuestion();

  const options: Q = {
    ...obj,
    type: 'checkbox',
  };
  const answer = await inquirer.prompt(options);
  const value = answer[obj.name!];

  if (!obj.disableTracking) {
    logAction('question:' + obj.name!, value, { success: true });
  }

  return value;
}

export async function listQuestion<
  R extends Record<string, unknown> | string | null = string,
  Q extends AugmentedListQuestion = AugmentedListQuestion,
>(obj: Q): Promise<R> {
  await canAskQuestion();

  const options: Q = {
    ...obj,
    type: 'list',
  };
  const answer = await inquirer.prompt(options);
  const value = answer[obj.name!];

  if (!obj.disableTracking) {
    logAction('question:' + obj.name!, value, { success: true });
  }

  return value;
}

type CRPQuestion = {
  disableTracking?: boolean;
};
type AugmentedDistinctQuestion = CRPQuestion &
  SetRequired<DistinctQuestion, 'name'>;
type AugmentedCheckboxQuestion = CRPQuestion &
  Omit<SetRequired<CheckboxQuestion, 'name' | 'choices'>, 'type'>;
type AugmentedListQuestion = CRPQuestion &
  Omit<SetRequired<ListQuestion, 'name' | 'choices'>, 'type'>;
