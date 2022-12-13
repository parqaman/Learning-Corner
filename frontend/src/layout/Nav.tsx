import { Box, chakra, HTMLChakraProps, List, ListItem, Button } from "@chakra-ui/react";

export const Nav = (props: HTMLChakraProps<"ul">) => {
    return <List {...props} display="flex" justifyContent={'space-around'}/>;
};

export const NavItem = (props: HTMLChakraProps<"li">) => {
    return <ListItem {...props} listStyleType={"none"} p={'0.25em'} m={'0.1em'}></ListItem>
};

export interface NavButtonProps extends HTMLChakraProps<"button"> {
    icon?: React.ReactNode;
};

export const NavButton = ({ icon, children, ...props }: NavButtonProps) => {
    return (
        <Button {...props}>
            {icon}
            {children}
        </Button>
    );
};

export interface NavLinkProps extends HTMLChakraProps<"a"> {}

export const NavLink = ({ children, ...linkProps }: NavLinkProps) => {
  return (
    <chakra.a {...linkProps}>
      <Box>{children}</Box>
    </chakra.a>
  );
};
