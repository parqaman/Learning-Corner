import { NavItem } from "./Nav";
import { BaseLayout, BaseLayoutProps } from "./BaseLayout";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
const navigationItems = (
  <>
      <NavItem>
        <Link to={'/home'}>Home</Link>
      </NavItem>
      <NavItem>
          <Link to={'/mycourses'}>My Courses</Link>
      </NavItem>
      <NavItem>
          <Link to={'/mygroups'}>My Groups</Link>
      </NavItem>
      <NavItem>
          <Link to={'/myprofile'}>Profile</Link>
      </NavItem>
  </>
);

export type AppLayoutProps = Partial<BaseLayoutProps>;

export const AppLayout = (props: AppLayoutProps) => {
  
  //check whether user is logged in or not, since navbar buttons are different for logged in user
  const { isLoggedIn } = useAuth();
  const HeaderRightMenu = isLoggedIn ? navigationItems : null;

  return <BaseLayout headerRightMenu={HeaderRightMenu} {...props}/>
}
