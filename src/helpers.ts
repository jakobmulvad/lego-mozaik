const defaultMozaikSize = 120;

export const suggestMozaikDimmensions = (sourceWidth: number, sourceHeight: number): [number, number] => {
  const scale = defaultMozaikSize / Math.max(sourceWidth, sourceHeight);
  return [Math.round(sourceWidth * scale), Math.round(sourceHeight * scale)];
};
