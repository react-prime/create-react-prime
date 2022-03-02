import { installersMap } from '@crp';


describe('Installers', () => {
  it('Returns a map of boilerplates names from the "installers" folder', async () => {
    expect(installersMap).toBeInstanceOf(Map);
    expect(installersMap.size).toBeGreaterThan(0);
    expect(installersMap.get('react-web')).toBeDefined();
    expect(installersMap.get('react-mobile')).toBeDefined();
  });
});
