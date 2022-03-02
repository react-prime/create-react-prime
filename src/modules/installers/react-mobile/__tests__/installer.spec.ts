import * as question from '../../../questions';
import installer from '../installer';


// Mock shared actions
vi.mock('../../shared/actions', () => ({
  clone: vi.fn(),
  npmInstall: vi.fn(),
  npmPackageUpdate: vi.fn(),
  cleanup: vi.fn(),
  renameProject: vi.fn(),
  renameFiles: vi.fn(),
}));

// Mock module actions
vi.mock('../actions', () => ({
  validateProjectName: vi.fn(),
  renameProject: vi.fn(),
  renameFiles: vi.fn(),
}));

// Mock logger
vi.mock('@crp/utils', () => ({
  logger: {
    whitespace: vi.fn(),
  },
}));


describe('react-mobile installer', () => {
  it('Opens the editor if user chooses an editor', async () => {
    vi.spyOn(question, 'openInEditor').mockResolvedValueOnce({ name: 'foo', search: 'bar' });
    const answerSpy = vi.spyOn(question, 'answerOpenInEditor')
      .mockImplementation(() => Promise.resolve());

    await installer();

    expect(answerSpy).toHaveBeenCalled();
  });
});
