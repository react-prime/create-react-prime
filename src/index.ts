import App from './App';
import CLIMgr from './CLIMgr';
/**
 * Commander has to be initialized at the very start of the application
 * It is then passed along to CLIMgr
 */
import CLI from './CLI';

// Initialize our CLI manager
const cliMgr = new CLIMgr(CLI);

// Start app
new App(cliMgr);
