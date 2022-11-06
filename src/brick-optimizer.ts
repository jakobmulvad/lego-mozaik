export type Brick = {
  length: number;
  width: number;
  element: number;
  price: number;
};

export type Placement = {
  x: number;
  y: number;
};

export type BrickPlacement = Placement & {
  brick: Brick;
};

export type BrickLayout = {
  width: number;
  height: number;
  mask: boolean[];
};

const plates: Brick[] = [
  {
    length: 1,
    width: 1,
    element: 302426,
    price: 0.43,
  },
  {
    length: 2,
    width: 1,
    element: 302326,
    price: 0.51,
  },
  {
    length: 3,
    width: 1,
    element: 302326,
    price: 0.51,
  },
  {
    length: 4,
    width: 1,
    element: 371026,
    price: 0.76,
  },
  {
    length: 4,
    width: 1,
    element: 371026,
    price: 0.76,
  },
  {
    length: 6,
    width: 1,
    element: 366626,
    price: 1.1,
  },
  {
    length: 8,
    width: 1,
    element: 346026,
    price: 1.36,
  },
  {
    length: 10,
    width: 1,
    element: 447726,
    price: 1.23,
  },
  {
    length: 3,
    width: 2,
    element: 302126,
    price: 1.01,
  },
  {
    length: 4,
    width: 2,
    element: 302026,
    price: 1.09,
  },
  {
    length: 6,
    width: 2,
    element: 379526,
    price: 1.49,
  },
  {
    length: 8,
    width: 2,
    element: 303426,
    price: 1.94,
  },
  {
    length: 10,
    width: 2,
    element: 383226,
    price: 2.24,
  },
  {
    length: 16,
    width: 2,
    element: 428226,
    price: 3.9,
  },
  {
    length: 4,
    width: 4,
    element: 4243819,
    price: 1.6,
  },
  {
    length: 8,
    width: 4,
    element: 303526,
    price: 3.56,
  },
  {
    length: 12,
    width: 4,
    element: 302926,
    price: 4.8,
  },
  {
    length: 6,
    width: 6,
    element: 395826,
    price: 4.14,
  },
  {
    length: 10,
    width: 6,
    element: 303326,
    price: 5.54,
  },
  {
    length: 12,
    width: 6,
    element: 302826,
    price: 12.61,
  },
  {
    length: 8,
    width: 8,
    element: 4166619,
    price: 9.88,
  },
  {
    length: 16,
    width: 16,
    element: 6306097,
    price: 20.43,
  },
];

const duplicatedPlatesByPrice = plates
  .slice()
  .sort((a, b) => a.price / (a.length * a.width) - b.price / (b.length * b.width))
  .reduce<Brick[]>((acc, val) => {
    acc.push(val);
    if (val.length !== val.width) {
      acc.push({
        ...val,
        width: val.length,
        length: val.width,
      });
    }
    return acc;
  }, []);

export const calculateBricks = (layout: BrickLayout): BrickPlacement[] => {
  // Create duplicate rotated bricks of the non-square and sort by cheapest to most expensive
  const result: BrickPlacement[] = [];

  for (const plate of duplicatedPlatesByPrice) {
    let placement: BrickPlacement | undefined;
    while ((placement = calculateBrickPlacement(layout, plate))) {
      result.push(placement);
    }
  }

  return result;
};

const calculateBrickPlacement = (layout: BrickLayout, brick: Brick): BrickPlacement | undefined => {
  for (let y = 0; y < layout.height - brick.length; y++) {
    for (let x = 0; x < layout.width - brick.width; x++) {
      if (canBrickFit(layout, x, y, brick)) {
        // Mark area as "taken"
        for (let by = y; by < brick.length + y; by++) {
          for (let bx = x; bx < brick.width + x; bx++) {
            layout.mask[bx + by * layout.width] = false;
          }
        }

        return { x, y, brick };
      }
    }
  }
  return undefined;
};

const canBrickFit = (layout: BrickLayout, x: number, y: number, brick: Brick): boolean => {
  for (let by = y; by < brick.length + y; by++) {
    for (let bx = x; bx < brick.width + x; bx++) {
      if (!layout.mask[bx + by * layout.width]) {
        return false;
      }
    }
  }
  return true;
};
