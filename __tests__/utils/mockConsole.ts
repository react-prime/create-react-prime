/* eslint-disable no-console */
const orgLog = console.log;

type RestoreConsole = () => void;

// Supress console.log output from tests
function mockConsole(): RestoreConsole {
  console.log = jest.fn();

  return function restoreConsole() {
    console.log = orgLog;
  };
}

export default mockConsole;
