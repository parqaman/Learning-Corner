import { chakra, HTMLChakraProps } from "@chakra-ui/react";

export type PageProps = HTMLChakraProps<"main">;

export const Page = ({ children, ...boxProps }: PageProps) => (
  <chakra.main
    display="flex"
    flexDirection="column"
    width="100%"
    {...boxProps}
  >
    {children}
  </chakra.main>
);
