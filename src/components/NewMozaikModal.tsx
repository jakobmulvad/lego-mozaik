import { FC, useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
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
import { DownloadIcon, ArrowForwardIcon, InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';

enum CreateMozaikState {
  ChooseImage,
  Configure,
}

export const NewMozaikModel: FC<Omit<ModalProps, 'children'>> = ({ ...modalProps }) => {
  const [step, setStep] = useState<CreateMozaikState>(CreateMozaikState.ChooseImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStep(CreateMozaikState.ChooseImage);
  }, [setStep, modalProps.isOpen]);

  if (step === CreateMozaikState.ChooseImage) {
    return (
      <Modal {...modalProps} closeOnOverlayClick={false}>
        <ModalContent>
          <ModalHeader>Choose input image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Load colors from an url or a file</Text>
            <Stack spacing={4} my={16}>
              <Flex justifyContent="center">
                <InputGroup>
                  <InputLeftAddon children="url" />
                  <Input placeholder="https://some.url/some-picture.jpg"></Input>
                </InputGroup>
              </Flex>

              <Text textAlign="center">Or</Text>

              <Flex justifyContent="center">
                <Button leftIcon={<DownloadIcon />} onClick={() => fileInputRef.current?.click()}>
                  Choose a file
                </Button>
                <Input display="none" type="file" ref={fileInputRef} />
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button rightIcon={<ArrowForwardIcon />} onClick={() => setStep(CreateMozaikState.Configure)}>
              Configure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal {...modalProps} closeOnOverlayClick={false}>
      <ModalContent>
        <ModalHeader>Configure mozaik</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Text>Choose the mozaik dimensions</Text>
            <Stack direction="row" alignItems="baseline">
              <Input placeholder="120"></Input>
              <Text>X</Text>
              <Input placeholder="80"></Input>
            </Stack>
            <Text color="orange.500">
              <WarningTwoIcon mr={1} />
              The aspec ratio of the input image (1:3) is very different from the aspect of the mozaik (1:6)
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
          <Button rightIcon={<ArrowForwardIcon />} onClick={modalProps.onClose}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// 265k - mui
// 403k - chakra
