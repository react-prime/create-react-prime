/** Terminal text style codes */
const terminalStyle = {
  title: '\x1b[1;4m',
  bold: '\x1b[1m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[2m',
  cyan: '\x1b[96m',
} as const;

type TerminalStyles = keyof typeof terminalStyle;


class Text {
  constructor(
    private _text = '',
  ) {}

  style(style: TerminalStyles): (str: string) => string {
    return (str: string) => this.createStr(terminalStyle[style], str);
  }

  // bold(str: string): Text {
  //   const bold = '\x1b[1m';

  //   return new Text(this.createStr(bold, str));
  // }


  private createStr(style: string, str: string): string {
    const reset = '\x1b[0m';

    return `${style}${str}${reset}`;
  }
}

/** Map all styles into writeable properties as methods */
type TextTypeExt = {
  -readonly [key in TerminalStyles]: (str: string) => string;
};

/** Update the Text class type with all the style methods */
interface Text extends TextTypeExt {
  // bold: (str: string) => Text & {
  //   -readonly [key in TerminalStyles]: (str: string) => string;
  // };
}

/** Add implementation of the style methods */
let style: TerminalStyles;
for (style in terminalStyle) {
  Text.prototype[style] = Text.prototype.style(style);
  // Text.prototype.bold[style] = Text.prototype.style(style);
}


export default Text;
