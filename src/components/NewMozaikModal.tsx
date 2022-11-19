import { FC } from 'react';
import {
  Button,
  Checkbox,
  Divider,
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

export const NewMozaikModel: FC<Omit<ModalProps, 'children'>> = ({ ...modalProps }) => {
  return (
    <>
      <Modal {...modalProps} closeOnOverlayClick={false}>
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text>Load colors from either a url or a file</Text>
              <Flex justifyContent="center">
                <InputGroup>
                  <InputLeftAddon children="https://" />
                  <Input placeholder="some.url/some-picture.jpg"></Input>
                </InputGroup>
              </Flex>

              <Text textAlign="center">Or</Text>

              <Flex justifyContent="center">
                <Button leftIcon={<DownloadIcon />} onClick={modalProps.onClose}>
                  Choose a file
                </Button>
              </Flex>
              <Divider></Divider>
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
              Configure mozaik
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// 265k - mui
// 403k - chakra
