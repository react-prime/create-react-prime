import type * as i from 'types';
import logger from '@crp/logger';
import { ERROR_TEXT } from '@crp/constants';

export const answersProxy: ProxyHandler<i.CRPAnswers> = {
  get(target, prop) {
    if (typeof prop === 'string') {
      const _prop = prop as AnswerKeys;
      const keys: AnswerKeys[] = ['boilerplate', 'projectName'];

      if (keys.includes(_prop) && target[_prop as AnswerKeys] == null) {
        logger.error(ERROR_TEXT.InvalidCLIState);
      }
    }

    return target[prop as AnswerKeys];
  },
};

type AnswerKeys = keyof i.CRPAnswers;
