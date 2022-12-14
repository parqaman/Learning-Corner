import { NavItem, NavLink } from "./Nav";
import { BaseLayout, BaseLayoutProps } from "./BaseLayout";
import { Link } from "react-router-dom";
const navigationItems = (
  <>
      <NavItem isPrivate={true}>
        <Link to={'/home'}>Home</Link>
      </NavItem>
      <NavItem isPrivate={true}>
          <Link to={'/mycourses'}>My Courses</Link>
      </NavItem>
      <NavItem isPrivate={true}>
          <Link to={'/mygroups'}>My Groups</Link>
      </NavItem>
      <NavItem isPrivate={true}>
          <Link to={'/myprofile'}>Profile</Link>
      </NavItem>
  </>
);

export type AppLayoutProps = Partial<BaseLayoutProps>;

export const AppLayout = (props: AppLayoutProps) => (
  <BaseLayout
    headerRightMenu={navigationItems}
    {...props}
  />
);
