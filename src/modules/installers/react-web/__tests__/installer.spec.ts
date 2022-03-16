import * as question from '../../../questions';
import installer from '../installer';

// Mock shared actions
vi.mock('../../shared/actions');

// Mock logger
vi.mock('@crp/utils');

// Mock questions
vi.mock('../../../questions');

describe('react-web installer', () => {
  it('Opens the editor if user chooses an editor', async () => {
    vi.spyOn(question, 'openInEditor').mockResolvedValueOnce({
      name: 'foo',
      search: 'bar',
    });
    const answerSpy = vi
      .spyOn(question, 'answerOpenInEditor')
      .mockImplementation(() => Promise.resolve());

    await installer();

    expect(answerSpy).toHaveBeenCalled();
  });
});
