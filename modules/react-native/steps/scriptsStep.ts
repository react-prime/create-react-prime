import Step from 'core/decorators/Step';


@Step({
  name: 'native-scripts',
  after: 'clone',
})
export default class ScriptsStep {
  on(): void {
    console.log('scripts step');
  }
}
