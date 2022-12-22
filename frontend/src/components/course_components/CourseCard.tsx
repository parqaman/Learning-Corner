import { SlideFade, Box } from '@chakra-ui/react'
import React from 'react'

export const CourseCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <SlideFade delay={0.2} in={true} style={{ width:'65%'}}>
      <Box
      minW="500px"
      bg={'white'}
      color={'black'}
      width={'100%'}
      padding='1.75rem'
      display='flex'
      flexDirection={'column'}
      borderRadius={'1rem'}
      boxShadow={'0 0.25rem 1.25rem rgba(0, 0, 0, 0.15)'}
      mb='3rem'
      >
        {children}
      </Box>
    </SlideFade>
  )
}
