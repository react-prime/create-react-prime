import { getApiUrl } from '../url';

describe('url', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return the correct production url', async () => {
    expect(getApiUrl()).toBe(
      'https://create-react-prime-dashboard.vercel.app/api',
    );
  });

  it('should return the correct beta url', async () => {
    process.env.APP_ENV = 'beta';

    expect(getApiUrl()).toBe(
      'https://create-react-prime-dashboard-git-develop-sandervspl.vercel.app/api',
    );
  });

  it('should return the correct development url', async () => {
    process.env.NODE_ENV = 'development';

    expect(getApiUrl()).toBe('http://localhost:3000/api');
  });
});
