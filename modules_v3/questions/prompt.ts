import type { State } from '../state/types';
import state from '../state';


function isArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length && value.every((item) => typeof item === 'string');
}

export default async function prompt<Key extends keyof State['answers']>(
  answerKey: Key,
  valueOrQuestion: ValueOrQuestion<Key>,
): Promise<State['answers']> {
  const answers = await state.set('answers', async (answers) => {
    if (typeof valueOrQuestion === 'string' || isArrayOfStrings(valueOrQuestion)) {
      // @ts-ignore it does not properly grab value type for key of question
      answers[answerKey] = valueOrQuestion;
    } else {
      answers[answerKey] = await valueOrQuestion();
    }
  });

  return answers;
}

type ValueOrQuestion<Key extends keyof State['answers']> =
| ((...args: unknown[]) => Promise<State['answers'][Key]>)
| State['answers'][Key];
