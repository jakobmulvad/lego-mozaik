import { LegoColor, LEGO_COLORS } from './lego-colors';

export type Dot = {
  element: number;
  color: LegoColor;
};

export const DOTS: Dot[] = [
  { element: 6284583, color: LEGO_COLORS.BrightYellowishGreen },
  { element: 6322819, color: LEGO_COLORS.MediumAzure },
  { element: 6284582, color: LEGO_COLORS.BrightOrange },
  { element: 6284575, color: LEGO_COLORS.BrightBlue },
  { element: 6284596, color: LEGO_COLORS.DarkStoneGrey },
  { element: 6284589, color: LEGO_COLORS.MediumNougat },
  { element: 6284586, color: LEGO_COLORS.ReddishBrown },
  //{ element: 6284585, color: LEGO_COLORS.DarkRed }, // dark red missing
  { element: 6284577, color: LEGO_COLORS.BrightYellow },
  //{ element: 6284574, color: LEGO_COLORS.BrightRed }, // bright red missing
  { element: 6284573, color: LEGO_COLORS.BrickYellow },
  { element: 6284572, color: LEGO_COLORS.White },
  { element: 6284070, color: LEGO_COLORS.Black },
  { element: 6284584, color: LEGO_COLORS.EarthBlue },
  { element: 6284071, color: LEGO_COLORS.MediumStoneGrey },
  { element: 6396247, color: LEGO_COLORS.DarkGreen },
  { element: 6343472, color: LEGO_COLORS.Nougat },
  { element: 6343806, color: LEGO_COLORS.CoolYellow },
  { element: 6284602, color: LEGO_COLORS.MediumBlue },
  { element: 6284598, color: LEGO_COLORS.SpringYellowishGreen },
  { element: 6322842, color: LEGO_COLORS.SandBlue },
  { element: 6322841, color: LEGO_COLORS.SandYellow },
  { element: 6322840, color: LEGO_COLORS.DarkOrange },
  { element: 6322824, color: LEGO_COLORS.DarkAzure },
  { element: 6322822, color: LEGO_COLORS.FlameYellowishOrange },
  { element: 6322818, color: LEGO_COLORS.Aqua },
  { element: 6353793, color: LEGO_COLORS.BrightGreen },
  { element: 6322813, color: LEGO_COLORS.DarkBrown },
  { element: 6311437, color: LEGO_COLORS.BrightBluishGreen },
  { element: 6315196, color: LEGO_COLORS.LightNougat },
  { element: 6284595, color: LEGO_COLORS.OliveGreen },
];

export const dotsInWorldmap: Record<number, number> = {
  6353793: 601,
  6284582: 601,
  6311437: 1879,
  6284583: 1060,
  6284584: 393,
  6322822: 599,
  6284573: 725,
  6322819: 1607,
  6311436: 601,
};
