import { runKernel } from '../utils/graphics';
import { expect, test } from 'vitest';

test('runKernel should correctly apply the kernel', () => {
  const kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

  const pixels = [0, 0, 0, 0, 255, 0, 0, 0, 0];
  const pixels4b = pixels.flatMap((n) => [n, n, n, 0]);
  const edge = runKernel(
    {
      width: 3,
      height: 3,
      data: new Uint8ClampedArray(pixels4b),
    },
    kernel
  );

  expect(edge).toEqual([-255, -255, -255, -255, 255 * 8, -255, -255, -255, -255]);
});
