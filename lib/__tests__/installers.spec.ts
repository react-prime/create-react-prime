describe('Installers', () => {
  let installersMap: Map<string, () => void>;

  // Make sure each import is fresh
  beforeEach(async () => {
    installersMap = (await import('@crp')).installersMap;
  });

  it('Returns a map of boilerplates names from the "installers" folder', async () => {
    expect(installersMap).toBeInstanceOf(Map);
    expect(installersMap.size).toBeGreaterThan(0);
    expect(installersMap.get('react-web')).toBeDefined();
    expect(installersMap.get('react-mobile')).toBeDefined();
  });
});
