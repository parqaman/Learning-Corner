import { useState } from 'react'
import { AppRoutes } from './AppRoutes'
import reactLogo from './assets/react.svg'
import { AppLayout } from './layout/AppLayout'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
