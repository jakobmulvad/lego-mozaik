import { FC } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export const FloatingPanel: FC<BoxProps> = ({ ...boxProps }) => {
  return <Box backgroundColor="rgba(0, 0, 0, 0.5)" p={4} m={4} borderRadius={8} {...boxProps}></Box>;
};
