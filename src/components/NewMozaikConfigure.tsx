import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowForwardIcon, InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { AppState } from '../app-state';
import { suggestMozaikDimmensions } from '../helpers';

export type NewMozaikConfigureProps = { imageData: ImageData; onDone: (state: AppState) => void } & Omit<
  ModalProps,
  'children'
>;

const sampleRect = (imageData: ImageData, rectX: number, rectY: number, rectW: number, rectH: number) => {
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

export const NewMozaikConfigure: FC<NewMozaikConfigureProps> = ({ imageData, onDone, ...modalProps }) => {
  const [width, setWidth] = useState('120');
  const [height, setHeight] = useState('80');

  useEffect(() => {
    const [mozaikWidth, mozaikHeight] = suggestMozaikDimmensions(imageData.width, imageData.height);

    setWidth(mozaikWidth.toString());
    setHeight(mozaikHeight.toString());
  }, [imageData]);

  const isInvalid = useMemo(() => {
    return !width || !height || isNaN(Number(width)) || isNaN(Number(height));
  }, [width, height]);

  const showAspectWarning = useMemo(() => {
    if (isInvalid) {
      return false;
    }

    const sourceAspect = imageData.width / imageData.height;
    const mozaikAspect = Number(width) / Number(height);
    return Math.abs(sourceAspect / mozaikAspect - 1) > 0.2;
  }, [isInvalid, width, height, imageData]);

  const sourceAspectDivident = useMemo(() => Math.min(imageData.width, imageData.height), [imageData]);

  const createHandler = useCallback(() => {
    const w = Number(width);
    const h = Number(height);
    const sampleWidth = imageData.width / w;
    const sampleHeight = imageData.height / h;

    const sourceColors = new Array<number>(w * h);

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const sx = Math.floor(x * sampleWidth);
        const sy = Math.floor(y * sampleHeight);
        const si = (sx + sy * imageData.width) * 4; // 4 bytes per pixel

        //sourceColors[x + y * w] = (imageData.data[si] << 16) | (imageData.data[si + 1] << 8) | imageData.data[si + 2];
        sourceColors[x + y * w] = sampleRect(imageData, sx, sy, sampleWidth, sampleHeight);
      }
    }

    onDone({
      width: w,
      height: h,
      sourceColors,
      colorAdjustment: {
        hue: 0,
        brightness: 0,
        saturation: 0,
        dithering: 0,
      },
    });
  }, [width, height, imageData]);

  return (
    <Modal closeOnOverlayClick={false} {...modalProps}>
      <ModalContent>
        <ModalHeader>Configure mozaik</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Text>Choose the mozaik dimensions</Text>
            <Stack direction="row" alignItems="baseline">
              <Input placeholder="120" value={width.toString()} onChange={(e) => setWidth(e.target.value)}></Input>
              <Text>X</Text>
              <Input placeholder="80" value={height.toString()} onChange={(e) => setHeight(e.target.value)}></Input>
            </Stack>
            <Text color="orange.500" visibility={showAspectWarning ? 'visible' : 'hidden'}>
              <WarningTwoIcon mr={1} />
              The aspect ratio of the input image ({(imageData.width / sourceAspectDivident).toFixed(2)} :{' '}
              {(imageData.height / sourceAspectDivident).toFixed(2)}) is very different from the aspect of the mozaik
            </Text>
            <Checkbox>
              Preserve aspect
              <Tooltip label="Instead of scaling source image to fit the aspect of the mozaik we instead crop it to preserve the aspect of the source image">
                <InfoIcon ml={1} />
              </Tooltip>
            </Checkbox>

            <Checkbox>
              Resample
              <Tooltip label="Instead of doing a single sample per mozaik tile we resample the source image to find the average color for each tile. This produces more accurate colors but tend to reduce detail.">
                <InfoIcon ml={1} />
              </Tooltip>
            </Checkbox>
            <Checkbox isDisabled={true}>
              Preserve detail
              <Tooltip label="Attempt to mitigate the loss of detail from resampling by applying an edge detection algorithm and prioritise the color of edges over smooth areas">
                <InfoIcon ml={1} />
              </Tooltip>
            </Checkbox>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button rightIcon={<ArrowForwardIcon />} onClick={createHandler} isDisabled={isInvalid}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
