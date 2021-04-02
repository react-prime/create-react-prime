import Step from 'core/decorators/Step';


@Step({
  name: 'clone',
})
export class CloneStep {
  constructor(
    private repoUrl: string,
  ) {}
}

