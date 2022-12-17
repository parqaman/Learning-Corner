import { NavItem } from "./Nav";
import { BaseLayout, BaseLayoutProps } from "./BaseLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { Menu, MenuButton, MenuList, useDisclosure } from "@chakra-ui/react"

export type AppLayoutProps = Partial<BaseLayoutProps>;

export const AppLayout = (props: AppLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigationItems = (
    <>
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
          <NavItem  _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>My Groups</NavItem>
        </Link>
        <Menu isOpen={isOpen}>
          <MenuButton onMouseEnter={onOpen} onMouseLeave={onClose} p={"0.25em"} _hover={{background: "rgba(0, 0, 0, 0.1)", borderRadius:"0.2rem"}}>
              <Link to={'/myprofile'}>Profile</Link>
          </MenuButton>
          <MenuList style={{background: "white", marginTop: "-0.5rem", boxShadow: "0 0 1rem 0.1rem rgba(0, 0, 0, 0.1)"}} onMouseEnter={onOpen} onMouseLeave={onClose}>
            <Link to={'/myprofile/edit'}>
              <NavItem _hover={{background:"rgba(0, 0, 0, 0.1)"}} fontSize={"sm"}>
                Edit profile
                </NavItem>
            </Link>
            <Link to={'/logout'}>
              <NavItem _hover={{background:"rgba(0, 0, 0, 0.1)"}} fontSize={"sm"}>Logout</NavItem>
            </Link>
          </MenuList>
        </Menu>
    </>
  );  

  //check whether user is logged in or not, since navbar buttons are different for logged in user
  const { isLoggedIn } = useAuth();
  const HeaderRightMenu = isLoggedIn ? navigationItems : null;

  return <BaseLayout headerRightMenu={HeaderRightMenu} {...props}/>
}
