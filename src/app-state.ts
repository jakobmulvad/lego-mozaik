export type AppState = {
  width: number;
  height: number;
  sourceColors: number[];
  colorAdjustment: {
    hue: number;
    saturation: number;
    brightness: number;
    dithering: number;
  };
};
