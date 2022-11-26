import { Box, Button, Text, Stack, useDisclosure, Slider, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { FC, useCallback, useMemo, useState } from 'react';
import { FloatingPanel } from './components/FloatingPanel';
import { NewMozaikModel } from './components/NewMozaikModal';
import { StarIcon, AddIcon } from '@chakra-ui/icons';
import { AppState } from './app-state';
import { Canvas } from './components/Canvas';
import { findBestMatchingColor, hslToRgb, rgbToHsl } from './lego-colors';

/*
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
*/

const App: FC = () => {
  const [appState, setAppState] = useState<AppState | undefined>();

  const legoColors = useMemo(() => {
    return appState?.sourceColors.map((color) => {
      /*const r = (color >> 16) & 0xff;
      const g = (color >> 8) & 0xff;
      const b = color & 0xff;*/

      // eslint-disable-next-line prefer-const
      let [h, s, l] = rgbToHsl([(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff]);

      h += appState.colorAdjustment.hue;
      s += appState.colorAdjustment.saturation;
      l += appState.colorAdjustment.brightness;

      const [r, g, b] = hslToRgb([h, s, l]);

      return findBestMatchingColor(r, g, b);
    });
  }, [appState]);

  /*const onChange = (evt: ChangeEvent<HTMLInputElement>, type: Layer['type']) => {
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
    }, 0);
  }, [layers]);*/

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onColorAdjustmentChange = useCallback(
    (property: keyof AppState['colorAdjustment'], value: number) => {
      setAppState(
        (state) =>
          state && {
            ...state,
            colorAdjustment: {
              ...state.colorAdjustment,
              [property]: value,
            },
          }
      );
    },
    [setAppState]
  );

  return (
    <main style={{ backgroundColor: '#202030', height: '100vh' }}>
      {legoColors && appState && <Canvas legoColors={legoColors} width={appState.width} height={appState.height} />}
      <Box position="absolute" left={8} top={8} flexDirection="column">
        <FloatingPanel>
          <Stack spacing={4} direction="row">
            <Button leftIcon={<StarIcon />} onClick={onOpen}>
              New mozaik
            </Button>
          </Stack>
        </FloatingPanel>

        <FloatingPanel>
          <Stack>
            <Text>Color adjustment</Text>
            <Text size="lg">Hue</Text>
            <Slider
              min={-180}
              max={180}
              value={appState?.colorAdjustment.hue ?? 0}
              onChange={(val) => onColorAdjustmentChange('hue', val)}
            >
              <SliderThumb />
              <SliderTrack />
            </Slider>
            <Text size="lg">Saturation</Text>
            <Slider
              min={-100}
              max={100}
              value={appState?.colorAdjustment.saturation ?? 0}
              onChange={(val) => onColorAdjustmentChange('saturation', val)}
            >
              <SliderThumb />
              <SliderTrack />
            </Slider>
            <Text size="lg">Brightness</Text>
            <Slider
              min={-100}
              max={100}
              value={appState?.colorAdjustment.brightness ?? 0}
              onChange={(val) => onColorAdjustmentChange('brightness', val)}
            >
              <SliderThumb />
              <SliderTrack />
            </Slider>
          </Stack>
        </FloatingPanel>

        <FloatingPanel>
          <Text>Elevation</Text>
          <Button leftIcon={<AddIcon />}>Add elevation</Button>
        </FloatingPanel>
      </Box>
      <NewMozaikModel isOpen={isOpen} onClose={onClose} onDone={setAppState} />
    </main>
  );
};

export default App;

/*<Stack direction="column" spacing={1}>
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
          </label>

          <label>
            <input style={{ display: 'none' }} type="file" onChange={(evt) => onChange(evt, 'PLATE')} />
          </label>
        </Stack>
          */
