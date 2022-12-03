import { Box, Button, Text, Stack, useDisclosure, Slider, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { FC, useCallback, useMemo, useState } from 'react';
import { FloatingPanel } from './components/FloatingPanel';
import { NewMozaikModel } from './components/NewMozaikModal';
import { StarIcon, AddIcon } from '@chakra-ui/icons';
import { AppState } from './app-state';
import { Canvas } from './components/Canvas';

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
    if (!appState) {
      return undefined;
    }

    return appState.sourceColors.map((s) => ({
      number: 1,
      code: s,
    }));

    /*const colorBuffer = appState.sourceColors.slice() as unknown as LegoColor[];
    const errorBufferR = new Int16Array((appState.width + 1) * (appState.height + 1)).fill(0);
    const errorBufferG = errorBufferR.slice();
    const errorBufferB = errorBufferR.slice();

    for (let y = 0; y < appState.height; y++) {
      for (let x = 0; x < appState.width; x++) {
        const i = x + y * appState.width;
        let ei = x + y * (appState.width + 1);
        const source = appState.sourceColors[x + y * appState.width];

        let [h, s, l] = rgbToHsl([(source >> 16) & 0xff, (source >> 8) & 0xff, source & 0xff]);

        h += appState.colorAdjustment.hue;
        s *= 1 + appState.colorAdjustment.saturation * 0.01;
        l *= 1 + appState.colorAdjustment.brightness * 0.01;

        let [r, g, b] = hslToRgb([h, s, l]);

        r += errorBufferR[ei] * appState.colorAdjustment.dithering * 0.01;
        g += errorBufferG[ei] * appState.colorAdjustment.dithering * 0.01;
        b += errorBufferB[ei] * appState.colorAdjustment.dithering * 0.01;

        const bestMatch = findBestMatchingColor(r, g, b);

        colorBuffer[i] = bestMatch;

        const errorR = r - ((bestMatch.code >> 16) & 0xff);
        const errorG = g - ((bestMatch.code >> 8) & 0xff);
        const errorB = b - (bestMatch.code & 0xff);

        // Floyd–Steinberg dithering weights
        ei++;
        errorBufferR[ei] += Math.round((errorR * 7) / 16);
        errorBufferG[ei] += Math.round((errorG * 7) / 16);
        errorBufferB[ei] += Math.round((errorB * 7) / 16);

        if (x > 0) {
          ei += appState.width - 1;
          errorBufferR[ei] += Math.round((errorR * 3) / 16);
          errorBufferG[ei] += Math.round((errorG * 3) / 16);
          errorBufferB[ei] += Math.round((errorB * 3) / 16);
        }

        ei++;
        errorBufferR[ei] += Math.round((errorR * 5) / 16);
        errorBufferG[ei] += Math.round((errorG * 5) / 16);
        errorBufferB[ei] += Math.round((errorB * 5) / 16);

        ei++;
        errorBufferR[ei] += Math.round(errorR / 16);
        errorBufferG[ei] += Math.round(errorG / 16);
        errorBufferB[ei] += Math.round(errorB / 16);
      }
    }
    return colorBuffer;
    ¨
  */
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
    <T extends keyof AppState['colorAdjustment']>(property: T, value: AppState['colorAdjustment'][T]) => {
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
            <Text fontSize="xl">Color adjustment</Text>
            <Text size="lg">Hue ({appState?.colorAdjustment.hue ?? 0}°)</Text>
            <Slider
              min={-90}
              max={90}
              value={appState?.colorAdjustment.hue ?? 0}
              onChange={(val) => onColorAdjustmentChange('hue', val)}
            >
              <SliderThumb />
              <SliderTrack />
            </Slider>
            <Text>Saturation ({appState?.colorAdjustment.saturation ?? 0}%)</Text>
            <Slider
              min={-100}
              max={100}
              value={appState?.colorAdjustment.saturation ?? 0}
              onChange={(val) => onColorAdjustmentChange('saturation', val)}
            >
              <SliderThumb />
              <SliderTrack />
            </Slider>
            <Text>Brightness ({appState?.colorAdjustment.brightness ?? 0}%)</Text>
            <Slider
              min={-100}
              max={100}
              value={appState?.colorAdjustment.brightness ?? 0}
              onChange={(val) => onColorAdjustmentChange('brightness', val)}
            >
              <SliderThumb />
              <SliderTrack />
            </Slider>
            <Text>Dithering ({appState?.colorAdjustment.dithering ?? 0}%)</Text>
            <Slider
              min={0}
              max={100}
              value={appState?.colorAdjustment.dithering ?? 0}
              onChange={(val) => onColorAdjustmentChange('dithering', val)}
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
