import { AppRoutes } from './AppRoutes'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './providers/AuthProvider';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes/>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
