import React from 'react';
import { Box, SlideFade } from '@chakra-ui/react';

export const NewCourseCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <SlideFade delay={0.2} in={true} style={{ width: '55%', display: 'flex', justifyContent: 'center' }}>
      <Box
        id="AuthCard"
        minH="28rem"
        minW="32rem"
        maxH={'45rem'}
        maxW={'60rem'}
        bg={'white'}
        color={'black'}
        width={'100%'}
        padding="2rem 7rem"
        display="flex"
        flexDirection={'column'}
        justifyContent="center"
        gap={'1em'}
        borderRadius={'1rem'}
        boxShadow={'0 0.25rem 1.25rem rgba(0, 0, 0, 0.15)'}
      >
        {children}
      </Box>
    </SlideFade>
  );
};
