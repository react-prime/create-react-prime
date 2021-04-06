import os from 'os';


class Validate {
  folderName(name?: string): boolean {
    if (!name) {
      return false;
    }

    // source: https://kb.acronis.com/content/39790
    let illegalChars = new RegExp('');

    switch (os.type()) {
      case 'WINDOWS_NT':
        illegalChars = /[\^\\/?*:|"<> ]+/;
        break;
      case 'Darwin':
        // These are allowed but produce unwanted results
        illegalChars = /[\/:]+/;
        break;
      case 'Linux':
      default:
        illegalChars = /[\/]+/;
    }

    const hasIllegalChars = illegalChars.test(name);

    return !hasIllegalChars;
  }
}

export default Validate;
