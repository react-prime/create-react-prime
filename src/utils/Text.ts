/** Terminal text style codes */
const terminalStyle = {
  bold: '\x1b[1m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
} as const;

type TerminalStyles = keyof typeof terminalStyle;


class Text {
  style(style: TerminalStyles): (str: string) => string {
    const reset = '\x1b[0m';

    return (str: string) => `${terminalStyle[style]}${str}${reset}`;
  }
}

/** Map all styles into writeable properties as methods */
type TextTypeExt = {
  -readonly [key in TerminalStyles]: (str: string) => string;
};

/** Update the Text class type with all the style methods */
interface Text extends TextTypeExt {}

/** Add implementation of the style methods */
let style: TerminalStyles;
for (style in terminalStyle) {
  Text.prototype[style] = Text.prototype.style(style);
}

export default Text;
