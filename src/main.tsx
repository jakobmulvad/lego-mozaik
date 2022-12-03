import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme, withDefaultProps } from '@chakra-ui/react';

const theme = extendTheme(
  withDefaultProps({
    defaultProps: {
      colorScheme: 'blue',
    },
    components: ['Button'],
  })
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
