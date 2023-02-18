import { chakra, HTMLChakraProps } from '@chakra-ui/react';

export type PageProps = HTMLChakraProps<'main'>;

export const Page = ({ children, ...boxProps }: PageProps) => (
  <chakra.main width="100%" minH={'90vh'} {...boxProps} color="black" p={'0 5rem'}>
    {children}
  </chakra.main>
);
