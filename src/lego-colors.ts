export type LegoColor = {
  number: number;
  code: number;
};

export const LEGO_COLORS: Record<string, LegoColor> = {
  Aqua: { number: 323, code: 0xc1e4da },
  Black: { number: 26, code: 0x000000 },
  BrickYellow: { number: 5, code: 0xddc48e },
  BrightBlue: { number: 23, code: 0x006cb7 },
  BrightYellow: { number: 24, code: 0xffcd03 },
  BrightGreen: { number: 37, code: 0x00af4d },
  BrightOrange: { number: 106, code: 0xf57d20 },
  BrightBluishGreen: { number: 107, code: 0x1da8a1 },
  BrightYellowishGreen: { number: 119, code: 0x9aca3c },
  CoolYellow: { number: 226, code: 0xfff579 },
  DarkGreen: { number: 28, code: 0x009247 },
  DarkOrange: { number: 38, code: 0xa65322 },
  DarkStoneGrey: { number: 199, code: 0x646765 },
  DarkBrown: { number: 308, code: 0x3b180d },
  DarkAzure: { number: 321, code: 0x00a3da },
  EarthBlue: { number: 140, code: 0x00395e },
  FlameYellowishOrange: { number: 191, code: 0xfbab18 },
  LightNougat: { number: 283, code: 0xfcc39e },
  MediumBlue: { number: 102, code: 0x489ece },
  MediumStoneGrey: { number: 194, code: 0xa0a19f },
  MediumNougat: { number: 312, code: 0xaf7446 },
  MediumAzure: { number: 322, code: 0x00bed3 },
  Nougat: { number: 18, code: 0xde8b5f },
  OliveGreen: { number: 330, code: 0x828353 },
  ReddishBrown: { number: 192, code: 0x692e14 },
  SandBlue: { number: 135, code: 0x678297 },
  SandYellow: { number: 138, code: 0x947e5f },
  SpringYellowishGreen: { number: 326, code: 0xcce197 },
  White: { number: 1, code: 0xf4f4f4 },
};

/*
export const LEGO_COLORS: Record<string, LegoColor> = {
  White: { number: 1, code: 'FFFFFF' },
  BrickYellow: { number: 5, code: 'E4CD9E' },
  Nougat: { number: 18, code: 'D09168' },
  BrightBlue: { number: 23, code: '0055BF' },
  BrightYellow: { number: 24, code: 'F2CD37' },
  Black: { number: 26, code: '05131D' },
  DarkGreen: { number: 28, code: '237841' },
  BrightGreen: { number: 37, code: '4B9F4A' },
  DarkOrange: { number: 38, code: 'A95500' },
  MediumBlue: { number: 102, code: '5A93DB' },
  BrightOrange: { number: 106, code: 'FE8A18' },
  BrightBluishGreen: { number: 107, code: '08F9B' },
  SandBlue: { number: 135, code: '6074A1' },
  SandYellow: { number: 138, code: '958A73' },
  EarthBlue: { number: 140, code: '0A3463' },
  BrightYellowishGreen: { number: 119, code: 'BBE90B' },
  FlameYellowishOrange: { number: 191, code: 'F8BB3D' },
  ReddishBrown: { number: 192, code: '582A12' },
  MediumStoneGrey: { number: 194, code: 'A0A5A9' },
  DarkStoneGrey: { number: 199, code: '6C6E68' },
  // LightRoyalBlue: { number: 212, code: '9FC3E9' }, // no dot in this color?
  CoolYellow: { number: 226, code: 'FFF03A' },
  LightNougat: { number: 283, code: 'F6D7B3' },
  DarkBrown: { number: 308, code: '352100' },
  MediumNougat: { number: 312, code: 'AA7D55' },
  DarkAzure: { number: 321, code: '078BC9' },
  MediumAzure: { number: 322, code: '36AEBF' },
  Aqua: { number: 323, code: 'ADC3C0' },
  SpringYellowishGreen: { number: 326, code: 'DFEEA5' },
  OliveGreen: { number: 330, code: '9B9A5A' },
};
*/

export const findBestMatchingColor = (r: number, g: number, b: number): LegoColor => {
  let bestMatch = LEGO_COLORS.Black;
  let bestError = Number.POSITIVE_INFINITY;
  for (const color of Object.values(LEGO_COLORS)) {
    const dr = r - ((color.code >> 16) & 0xff);
    const dg = g - ((color.code >> 8) & 0xff);
    const db = b - (color.code & 0xff);
    const error = dr * dr + dg * dg + db * db;
    if (error < bestError) {
      bestError = error;
      bestMatch = color;
    }
  }
  return bestMatch;
};

export const hexToRGB = (hex: string): [number, number, number] => [
  parseInt(hex.slice(0, 2), 16),
  parseInt(hex.slice(2, 4), 16),
  parseInt(hex.slice(4, 6), 16),
];

export const rgbToHsl = (rgb: [number, number, number]) => {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else {
    // b === max
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
};

export const hslToRgb = (hsl: [number, number, number]) => {
  const h = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }

  const t1 = 2 * l - t2;

  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1);
    if (t3 < 0) {
      t3++;
    }

    if (t3 > 1) {
      t3--;
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }

    rgb[i] = val * 255;
  }

  return rgb;
};

/*
public class LegoColors
{

  public static Color[] LEGO_COLORS = {
  };

  public static Color ColorFromHex(string hex)
  {
    var r = byte.Parse(hex.Substring(0, 2), NumberStyles.HexNumber);
    var g = byte.Parse(hex.Substring(2, 2), NumberStyles.HexNumber);
    var b = byte.Parse(hex.Substring(4, 2), NumberStyles.HexNumber);
    return new Color32(r, g, b, 255);
  }

  public static Color FindClosestMatch(Color32 color)
  {
    float bestError = float.MaxValue;
    var bestColor = LEGO_COLORS[0];

    foreach (var legoColor in LegoColors.LEGO_COLORS)
    {
      var error = ColorError(color, legoColor);

      if (error < bestError)
      {
        bestColor = legoColor;
        bestError = error;
      }
    }

    return bestColor;
  }

*/
