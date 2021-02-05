import os from 'os';

export default class Validate {
  get illegalChars(): RegExp {
    // source: https://kb.acronis.com/content/39790

    switch (os.type()) {
      case 'WINDOWS_NT':
        return /[\^\\/?*:|"<> ]+/;
      case 'Darwin':
        // / is allowed but produces unwanted results
        return /[\/:]+/;
      case 'Linux':
      default:
        return /[\/]+/;
    }
  }

  folderName(name?: string): boolean {
    if (!name) {
      return false;
    }

    const hasIllegalChars = this.illegalChars.test(name);

    return !hasIllegalChars;
  }
}
