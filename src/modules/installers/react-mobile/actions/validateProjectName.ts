import { state } from '@crp';

export function validateProjectName(): boolean {
  return /^.*[^a-zA-Z0-9].*$/.test(state.answers.projectName) === false;
}
