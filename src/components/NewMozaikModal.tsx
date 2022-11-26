import { FC, useCallback, useEffect, useState } from 'react';
import { ModalProps } from '@chakra-ui/react';
import { NewMozaikChooseImage } from './NewMozaikChooseImage';
import { NewMozaikConfigure } from './NewMozaikConfigure';
import { AppState } from '../app-state';

export type NewMozaikModelProps = { onDone: (appState: AppState) => void } & Omit<ModalProps, 'children'>;

export const NewMozaikModel: FC<NewMozaikModelProps> = ({ onDone, ...modalProps }) => {
  const [imageData, setImageData] = useState<ImageData | undefined>();

  const handleDone = useCallback(
    (appState: AppState) => {
      modalProps.onClose();
      onDone(appState);

      console.log('Created new mozaik');
      console.log(appState);
    },
    [onDone, modalProps.onClose]
  );

  useEffect(() => {
    if (modalProps.isOpen) {
      setImageData(undefined);
    }
  }, [modalProps.isOpen]);

  if (imageData) {
    return <NewMozaikConfigure {...modalProps} imageData={imageData} onDone={handleDone} />;
  }

  return <NewMozaikChooseImage {...modalProps} onDone={setImageData} />;
};
