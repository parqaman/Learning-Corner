import { Flex, Text } from "@chakra-ui/react";
import { Link } from 'react-router-dom'
import { Nav } from "./Nav";

export type AppHeaderProps = {
    headerRightMenu: React.ReactNode;
};  

export const AppHeader = (props: AppHeaderProps) => {
  return (
  <Flex
    as="header"
    bg="white"
    alignItems="center"
    justifyContent="space-between"
    p="0.75rem"
    borderBottom={'solid 3px'}
    borderBottomColor={'#0194F3'}
    boxShadow={'0 4px 5px 0 rgba(0, 0, 0, 0.15)'}
    >
        <Link to={"/"}><Text fontSize={'xl'} fontWeight={'semibold'}>Learning Corner</Text></Link>
        <Nav width={'35%'}>{props.headerRightMenu}</Nav>
    </Flex>
    )
}