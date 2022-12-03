import {
  Button,
  Flex,
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
} from '@chakra-ui/react';
import { ChangeEvent, FC, useCallback, useRef, useState } from 'react';
import { DownloadIcon, WarningTwoIcon } from '@chakra-ui/icons';

export type NewMozaikChooseImageProps = { onDone: (imageData: ImageData) => void } & Omit<ModalProps, 'children'>;

export const NewMozaikChooseImage: FC<NewMozaikChooseImageProps> = ({ onDone, ...modalProps }) => {
  const [imageUrl, setImageUrl] = useState(
    'https://assets.change.org/photos/9/rg/bj/nmrgBjEiSuFQlGQ-1600x900-noPad.jpg?1626182653'
  );
  const [error, setError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setImageUrl(event.target.value);
    },
    [setImageUrl]
  );

  const handleDone = useCallback(
    (url: string) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setError('Failed to create offscreen context');
          return;
        }

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        onDone(imageData);
      };
      image.onerror = (err) => {
        setError(typeof err === 'string' ? err : 'Something went wrong reading the file');
      };
      image.src = url;
    },
    [setError, onDone]
  );

  const handleDownload = useCallback(() => {
    handleDone(imageUrl);
  }, [handleDone, imageUrl]);

  const handleFileChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const file = evt.target.files?.[0];
      if (!file) {
        return;
      }
      const fileUrl = URL.createObjectURL(file);
      handleDone(fileUrl);
    },
    [handleDone]
  );

  return (
    <Modal size="2xl" closeOnOverlayClick={false} {...modalProps}>
      <ModalContent>
        <ModalHeader>Choose input image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Load colors from an url or a file</Text>
          <Stack spacing={8} m={16}>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Input
                placeholder="https://some.url/some-picture.jpg"
                value={imageUrl}
                onChange={handleUrlChange}
              ></Input>
              <Button px={6} leftIcon={<DownloadIcon />} size="md" onClick={handleDownload}>
                Download
              </Button>
            </Stack>

            <Text textAlign="center">Or</Text>

            <Flex justifyContent="center">
              <Button leftIcon={<DownloadIcon />} onClick={() => fileInputRef.current?.click()}>
                Choose a file
              </Button>
              <Input display="none" type="file" ref={fileInputRef} onChange={handleFileChange} />
            </Flex>
          </Stack>
        </ModalBody>
        {error && (
          <ModalFooter color="red.500" justifyContent="center">
            <WarningTwoIcon mr={2} />
            {error}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
