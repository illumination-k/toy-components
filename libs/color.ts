export default class Color {
  red: number;
  blue: number;
  green: number;

  private constructor(red: number, blue: number, green: number) {
    this.red = red;
    this.blue = blue;
    this.green = green;
  }

  static New(red: number, blue: number, green: number) {
    return new Color(red, blue, green);
  }

  static FromHex(hex: string) {
    const red = parseInt(hex.substring(1, 3), 16);
    const green = parseInt(hex.substring(3, 5), 16);
    const blue = parseInt(hex.substring(5, 7), 16);

    return new Color(red, blue, green);
  }

  static WHITE() {
    return new Color(255, 255, 255);
  }

  static BLACK() {
    return new Color(0, 0, 0);
  }

  get hexColor() {
    const hex = [
      `0${this.red.toString(16)}`.slice(-2),
      `0${this.green.toString(16)}`.slice(-2),
      `0${this.blue.toString(16)}`.slice(-2),
    ].join("");

    return `#${hex}`;
  }

  private getRelativeLuminance() {
    return 0.2126 * getRGBForCalculateLuminance(this.red) + 0.7152 * getRGBForCalculateLuminance(this.green)
      + 0.0722 * getRGBForCalculateLuminance(this.blue);
  }

  static getContrastRatio(color1: Color, color2: Color) {
    const luminance1 = color1.getRelativeLuminance();
    const luminance2 = color2.getRelativeLuminance();
    const bright = Math.max(luminance1, luminance2);
    const dark = Math.min(luminance1, luminance2);
    return (bright + 0.05) / (dark + 0.05);
  }

  getFontColor(backgroundColor: Color) {
    const whiteRatio = Color.getContrastRatio(backgroundColor, Color.WHITE());
    const blackRatio = Color.getContrastRatio(backgroundColor, Color.BLACK());
    const fontColor = whiteRatio > blackRatio ? Color.WHITE() : Color.BLACK();

    return fontColor;
  }
}

const getRGBForCalculateLuminance = (_color: number) => {
  const color = _color / 255;
  if (color <= 0.03928) {
    return color / 12.92;
  } else {
    return Math.pow((color + 0.055) / 1.055, 2.4);
  }
};
