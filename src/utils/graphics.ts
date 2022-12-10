export type ImageDataLike = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

const colorFactor = 1 / 3;

export const runKernel = (imageData: ImageDataLike, kernel9x9: number[]): number[] => {
  const result = new Array<number>(imageData.width * imageData.height).fill(0);

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const si = x + y * imageData.width;
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const ki = kx + ky * 3;
          const clampedX = Math.max(Math.min(x + kx - 1, imageData.width - 1), 0);
          const clampedY = Math.max(Math.min(y + ky - 1, imageData.height - 1), 0);
          const clampedI = (clampedX + clampedY * imageData.width) * 4;

          const avgColor =
            (imageData.data[clampedI] + imageData.data[clampedI + 1] + imageData.data[clampedI + 2]) * colorFactor;

          result[si] += avgColor * kernel9x9[ki];
        }
      }
    }
  }

  return result;
};

export const sampleRect = (imageData: ImageData, rectX: number, rectY: number, rectW: number, rectH: number) => {
  let accR = 0;
  let accG = 0;
  let accB = 0;

  for (let y = rectY; y < rectY + rectH; y++) {
    for (let x = rectX; x < rectX + rectW; x++) {
      const si = (x + y * imageData.width) * 4; // 4 bytes per pixel
      accR += imageData.data[si];
      accG += imageData.data[si + 1];
      accB += imageData.data[si + 2];
    }
  }

  const factor = 1 / (Math.ceil(rectW) * Math.ceil(rectH));
  return (
    ((Math.floor(accR * factor) & 0xff) << 16) |
    ((Math.floor(accG * factor) & 0xff) << 8) |
    (Math.floor(accB * factor) & 0xff)
  );
  //return accB & 0xff;
};

export const mostSignificantColor = (
  imageData: ImageData,
  edges: number[],
  rectX: number,
  rectY: number,
  rectW: number,
  rectH: number
) => {
  let significantColor = 0;
  let significantEdgeValue = Number.NEGATIVE_INFINITY;
  for (let y = rectY; y < rectY + rectH; y++) {
    for (let x = rectX; x < rectX + rectW; x++) {
      const ki = x + y * imageData.width;

      if (edges[ki] > significantEdgeValue) {
        significantEdgeValue = edges[ki];

        const si = ki * 4;
        significantColor = (imageData.data[si] << 16) | (imageData.data[si + 1] << 8) | imageData.data[si + 2];
      }
    }
  }

  return significantColor;
};
