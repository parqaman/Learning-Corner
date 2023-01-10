import { NavItem } from "./Nav";
import { BaseLayout, BaseLayoutProps } from "./BaseLayout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { Text, Flex, Menu, MenuButton, MenuList, useDisclosure } from "@chakra-ui/react"
import { RxHamburgerMenu } from 'react-icons/rx'
import { GrClose } from 'react-icons/gr'
import { useState } from "react";
export type AppLayoutProps = Partial<BaseLayoutProps>;
import React from "react";

export const AppLayout = (props: AppLayoutProps) => {
  const [drawer, setDrawer] = useState('none');
  const profileDisclosure = useDisclosure()
  const hamburgerDisclosure = useDisclosure()
  const useLogout = useAuth().actions.logout;
  const navigate = useNavigate();

  const HamburgerMenuItems = () => {
    return (
      <Flex
        w={'65%'}
        h={'100vh'}
        top={0}
        right={0}
        pos={'fixed'}
        flexDir={"column"}
        zIndex={20}
        bg={'white'}
        padding={'1rem'}
        display={drawer}
        boxShadow={'0 0.25rem 1.25rem rgba(0, 0, 0, 0.15)'}
      >
        <Flex justifyContent={'space-between'}>
          <Text fontSize={'xl'} mb={'1em'}>Where to go?</Text>
          <Flex flexDirection={'column'} pt={'0.5rem'} cursor='pointer' onClick={()=>setDrawer('none')}>
            <GrClose/>
          </Flex>
        </Flex>
        <Link to={'/home'}>
            <NavItem _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
              Home
            </NavItem>
          </Link>
          <Link to={'/courses'}>
            <NavItem _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
                My Courses
            </NavItem>
          </Link>
          <Link to={'/groups'}>
            <NavItem  _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
              My Groups
            </NavItem>
          </Link>
          <Link to={'/profile'}>
            <NavItem  _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
              My Profile
            </NavItem>
          </Link>
      </Flex>
    )
  }

  const navigationItems = (
    <>
      <Flex display={{base: "none", sm: "flex"}} justifyContent={'space-between'} width={'100%'}>
          <Link to={'/home'}>
            <NavItem _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
              Home
            </NavItem>
          </Link>
          <Link to={'/mycourses'}>
            <NavItem _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
                My Courses
            </NavItem>
          </Link>
          <Link to={'/mygroups'}>
            <NavItem  _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
              My Groups
            </NavItem>
          </Link>
          <Menu isOpen={profileDisclosure.isOpen}>
            <MenuButton onClick={()=>navigate('/profile')} onMouseEnter={profileDisclosure.onOpen} onMouseLeave={profileDisclosure.onClose} p={"0.25em"} _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
                <Link to={'/profile'}>Profile</Link>
            </MenuButton>
            <MenuList style={{background: "white", marginTop: "-0.5rem", boxShadow: "0 0 1rem 0.1rem rgba(0, 0, 0, 0.1)"}} onMouseEnter={profileDisclosure.onOpen} onMouseLeave={profileDisclosure.onClose}>
              <Link to={'/profile'}>
                <NavItem _hover={{background:"rgba(0, 0, 0, 0.1)"}} fontSize={"sm"}>
                  My profile
                </NavItem>
              </Link>
              <Link to={'/'}>
                <NavItem _hover={{background:"rgba(0, 0, 0, 0.1)"}} fontSize={"sm"}
                  onClick={useLogout}
                >
                  Logout
                </NavItem>
              </Link>
            </MenuList>
          </Menu>
        </Flex>
        <Flex 
          display={{base: "flex", sm: "none"}}
          onClick={hamburgerDisclosure.onOpen}
        >
          <RxHamburgerMenu cursor={'pointer'} onClick={ ()=>setDrawer('flex')}/>
          <HamburgerMenuItems/>
        </Flex>
    </>
  );
  
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, []);    

  //check whether user is logged in or not, since navbar buttons are different for logged in user
  const { isLoggedIn } = useAuth();
  const HeaderRightMenu = isLoggedIn ? navigationItems : null;
  if(!isLoggedIn && window.location.pathname !== '/auth/login') window.location.href = '/auth/login';
  return <BaseLayout headerRightMenu={HeaderRightMenu} {...props}/>
}
