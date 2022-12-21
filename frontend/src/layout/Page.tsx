import { chakra, HTMLChakraProps } from "@chakra-ui/react";

export type PageProps = HTMLChakraProps<"main">;

export const Page = ({ children, ...boxProps }: PageProps) => (
  <chakra.main
    display="flex"
    flexDirection="column"
    alignItems={'center'}
    justifyContent={'center'}
    width="100%"
    minH={'90vh'}
    {...boxProps}
    color='black'
  >
    {children}
  </chakra.main>
);
