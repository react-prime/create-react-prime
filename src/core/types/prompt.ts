import { Question, Answers } from 'inquirer';

export type CRPQuestion<T extends Question = Question> = T & {
  isValidForOS: boolean;
  isOptional: boolean;
  answer?(answers: Answers): Promise<void>;
}
