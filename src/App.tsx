import { ChangeEvent, FC, useEffect, useState } from 'react';
import './App.css';
import { calculateBricks } from './brick-optimizer';
import { Canvas, DotLayer, Layer, PlateLayer } from './Canvas';
import { Dot, dotsInWorldmap, findBestMatchingDot } from './dots';

const buildPlateLayer = (imageData: ImageData): PlateLayer => {
  const mask: boolean[] = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    mask.push(imageData.data[i] !== 0);
  }

  const placements = calculateBricks({
    width: imageData.width,
    height: imageData.height,
    mask,
  });

  return { type: 'PLATE', placements };
};

const buildDotLayer = (imageData: ImageData): DotLayer => {
  const dots: Dot[] = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    dots.push(findBestMatchingDot(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]));
  }

  const elementDistribution = dots.reduce<Record<number, number>>((acc, dot) => {
    acc[dot.element] = 1 + (acc[dot.element] ?? 0);
    return acc;
  }, {});

  const totalPrice = Object.keys(elementDistribution).reduce<number>((acc, elementUn) => {
    const element = elementUn as unknown as number;
    const dotsFromWorldmap = dotsInWorldmap[element] ?? 0;
    const dotsNeeded = Math.max(0, elementDistribution[element] - dotsFromWorldmap);
    return acc + 0.26 * dotsNeeded;
  }, 0);

  console.log('total price DKK ', totalPrice.toFixed(2));

  return {
    type: 'DOT',
    dots,
  };
};

const App: FC = () => {
  const [layers, setLayers] = useState<Layer[]>([]);

  const onChange = (evt: ChangeEvent<HTMLInputElement>, type: Layer['type']) => {
    const file = evt.target.files?.[0];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!file || !ctx) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      let layer: Layer;

      switch (type) {
        case 'DOT':
          layer = buildDotLayer(imageData);
          break;
        case 'PLATE':
          layer = buildPlateLayer(imageData);
          break;
      }

      setLayers((curr) => [...curr, layer]);

      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  // Calculate shopping list
  useEffect(() => {
    const shoppingList: Record<number, number> = {};

    const addToShoppingList = (element: number) => {
      shoppingList[element] = (shoppingList[element] ?? 0) + 1;
    };

    // Count elements in layers
    for (const layer of layers) {
      switch (layer.type) {
        case 'DOT':
          layer.dots.map((d) => d.element).forEach(addToShoppingList);
          break;

        case 'PLATE':
          layer.placements.map((p) => p.brick.element).forEach(addToShoppingList);
          break;
      }
    }

    // Subtract elements from world map set
    for (const element of Object.keys(dotsInWorldmap)) {
      if (element in shoppingList) {
        const elementNo: number = element as unknown as number;
        const newCount = Math.max(0, shoppingList[elementNo] - dotsInWorldmap[elementNo]);
        if (newCount == 0) {
          delete shoppingList[elementNo];
        } else {
          shoppingList[elementNo] = newCount;
        }
      }
    }

    console.log(shoppingList);

    /*const totalPrice = Object.keys(elementDistribution).reduce<number>((acc, elementUn) => {
      const element = elementUn as unknown as number;
      const dotsFromWorldmap = dotsInWorldmap[element] ?? 0;
      const dotsNeeded = Math.max(0, elementDistribution[element] - dotsFromWorldmap);
      return acc + 0.26 * dotsNeeded;
    }, 0);*/
  }, [layers]);

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" accept="image/*" onChange={(evt) => onChange(evt, 'PLATE')} />
        <input type="file" accept="image/*" onChange={(evt) => onChange(evt, 'DOT')} />
        <Canvas layers={layers} />
      </header>
    </div>
  );
};

export default App;
