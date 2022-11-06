import { Box, Container, Button, Divider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { calculateBricks } from './brick-optimizer';
import { Canvas, DotLayer, Layer, PlateLayer } from './Canvas';
import { Dot, dotsInWorldmap, findBestMatchingDot } from './dots';
import UploadIcon from '@mui/icons-material/Upload';

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
    <main style={{ backgroundColor: '#202030', height: '100vh', color: '#efefef' }}>
      <Container>
        <Canvas layers={layers} />
      </Container>
      <Box position="absolute" left={8} top={8} flexDirection="column">
        <Stack
          direction="column"
          spacing={1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 8, borderRadius: 8 }}
        >
          <Box>
            <Typography variant="h5">Layers</Typography>
            {layers.map((l) => {
              if (l.type === 'DOT') {
                return <Typography ml={1}>Color ({l.dots.length} pieces)</Typography>;
              }
              return <Typography ml={1}>Elevation ({l.placements.length} pieces)</Typography>;
            })}
          </Box>
          <Divider></Divider>
          <label>
            <input style={{ display: 'none' }} type="file" onChange={(evt) => onChange(evt, 'DOT')} />

            <Button variant="contained" component="span" startIcon={<UploadIcon />}>
              Upload color layer
            </Button>
          </label>

          <label>
            <input style={{ display: 'none' }} type="file" onChange={(evt) => onChange(evt, 'PLATE')} />

            <Button variant="contained" component="span" startIcon={<UploadIcon />}>
              Upload elevation layer
            </Button>
          </label>
        </Stack>
      </Box>
    </main>
  );
};

export default App;
