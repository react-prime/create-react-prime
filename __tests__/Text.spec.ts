import Text from 'utils/Text';

describe('Text', () => {
  let text: Text;

  beforeEach(() => {
    text = new Text();
  });

  describe('style', () => {
    it('adds style to the text', () => {
      const str = text.style('bold')('test');

      expect(str).toEqual('\x1b[1m' + 'test' + '\x1b[0m');
    });
  });

  describe('style submethods', () => {
    it('adds working style submethods', () => {
      const str = text.bold('test');

      expect(str).toEqual('\x1b[1m' + 'test' + '\x1b[0m');
    });
  });
});
