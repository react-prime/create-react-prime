export default class Validate {
  filename(name?: string): boolean {
    if (!name) {
      return false;
    }

    const noIllegalChars = /^[^^\\/?%*:|"<>\. ]+$/.test(name);

    return name.length > 0 && noIllegalChars;
  }
}
