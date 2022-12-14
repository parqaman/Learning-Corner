import { Flex, Text } from "@chakra-ui/react";
import { Link } from 'react-router-dom'
import { Nav } from "./Nav";

export type AppHeaderProps = {
    headerRightMenu: React.ReactNode & { isPrivate?: boolean };
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
    color={'black'}
    >
        <Link to={"/"}><Text fontSize={'xl'} fontWeight={'semibold'}>Learning Corner</Text></Link>
        {
            //TODO: show navbar navigations only when user is logged in
            props.headerRightMenu?.isPrivate && <Nav width={'35%'}>{props.headerRightMenu}</Nav>
        }
    </Flex>
    )
}