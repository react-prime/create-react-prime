import * as actions from '../actions';

export default async function start(): Promise<void> {
  await actions.clone('https://github.com/react-prime/react-prime-native.git');
  await actions.npmInstall();
}
