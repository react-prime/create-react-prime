import Step from 'core/decorators/Step';
import cliMgr from 'core/CLIMgr';


@Step({
  name: 'native-scripts',
  after: 'update-package',
  spinner: {
    emoji: '🔤',
    message: {
      pending: () => `Renaming project files to '${cliMgr.getProjectName()}'...`,
      success: () => `Renamed project files to '${cliMgr.getProjectName()}'!`,
    },
  },
})
export default class ScriptsStep {
  on(): void {
    return;
  }
}
