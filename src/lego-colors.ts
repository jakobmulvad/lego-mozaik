export type LegoColor = {
  number: number;
  code: string;
};

export const LEGO_COLORS: Record<string, LegoColor> = {
  Aqua: { number: 323, code: 'c1e4da' },
  Black: { number: 26, code: '000000' },
  BrickYellow: { number: 5, code: 'ddc48e' },
  BrightBlue: { number: 23, code: '006cb7' },
  BrightYellow: { number: 24, code: 'ffcd03' },
  BrightGreen: { number: 37, code: '00af4d' },
  BrightOrange: { number: 106, code: 'f57d20' },
  BrightBluishGreen: { number: 107, code: '1da8a1' },
  BrightYellowishGreen: { number: 119, code: '9aca3c' },
  CoolYellow: { number: 226, code: 'fff579' },
  DarkGreen: { number: 28, code: '009247' },
  DarkOrange: { number: 38, code: 'a65322' },
  DarkStoneGrey: { number: 199, code: '646765' },
  DarkBrown: { number: 308, code: '3b180d' },
  DarkAzure: { number: 321, code: '00a3da' },
  EarthBlue: { number: 140, code: '00395e' },
  FlameYellowishOrange: { number: 191, code: 'fbab18' },
  LightNougat: { number: 283, code: 'fcc39e' },
  MediumBlue: { number: 102, code: '489ece' },
  MediumStoneGrey: { number: 194, code: 'a0a19f' },
  MediumNougat: { number: 312, code: 'af7446' },
  MediumAzure: { number: 322, code: '00bed3' },
  Nougat: { number: 18, code: 'de8b5f' },
  OliveGreen: { number: 330, code: '828353' },
  ReddishBrown: { number: 192, code: '692e14' },
  SandBlue: { number: 135, code: '678297' },
  SandYellow: { number: 138, code: '947e5f' },
  SpringYellowishGreen: { number: 326, code: 'cce197' },
  White: { number: 1, code: 'f4f4f4' },
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

export const hexToRGB = (hex: string): [number, number, number] => [
  parseInt(hex.slice(0, 2), 16),
  parseInt(hex.slice(2, 4), 16),
  parseInt(hex.slice(4, 6), 16),
];

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
