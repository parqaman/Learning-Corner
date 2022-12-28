import { Box, SlideFade } from '@chakra-ui/react'
import React from 'react'

export const ProfileCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <SlideFade delay={0.2} in={true}>
      <Box
      minH="450px"
      minW="500px"
      bg={'transparent'}
      color={'black'}
      width={'60%'}
      display='flex'
      flexDirection={'column'}
      gap={'1em'}
      >
        {children}
      </Box>
    </SlideFade>
  )
}
