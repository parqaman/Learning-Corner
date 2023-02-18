import React from 'react'
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

const AllProviders = ({children}:{children:any}) => {
  return (
    <ChakraProvider>
        {children}
    </ChakraProvider>
  )
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllProviders, ...options });

// re-export everything
export * from '@testing-library/react'

// override render method
export {customRender as render}