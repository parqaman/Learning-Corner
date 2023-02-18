import {
    Navigate,
    Route,
    RouteProps,
    Routes,
    useLocation,
  } from "react-router-dom";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { GroupDetailPage } from "./pages/GroupDetailPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MyCoursesPage } from "./pages/MyCoursesPage";
import { MyGroupsPage } from "./pages/MyGroupsPage";
import { NewCoursePage } from "./pages/NewCoursePage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SearchPage } from "./pages/SearchPage";
import { TextEditor } from "./pages/TextEditor";
import { useAuth } from "./providers/AuthProvider";
  
export type RouteConfig = RouteProps & { path: string; isPrivate?: boolean };

export const routes: RouteConfig[] = [
  {
      path: "/home",
      isPrivate: true,
      element: <HomePage />,
  },
  {
      path: "/",
      isPrivate: true,
      element: <Navigate to={"/home"} replace />,
      index: true,
  },
  {
    path: "/auth/login",
    isPrivate: false,
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    isPrivate: false,
    element: <RegisterPage />,
  },
  {
    path: "/profile",
    isPrivate: true,
    element: <ProfilePage />,
  },
  {
    path: "/profile/resetpassword",
    isPrivate: true,
    element: <ResetPasswordPage />,
  },
  {
    path: "/mycourses",
    isPrivate: true,
    element: <MyCoursesPage/>,
  },
  {
    path: "/mygroups",
    isPrivate: true,
    element: <MyGroupsPage/>,
  },
  {
    path: "/courses/:id",
    isPrivate: true,
    element: <CourseDetailPage />,
  },
  {
    path: "/courses/:courseID/groups/:groupID",
    isPrivate: true,
    element: <GroupDetailPage />,
  },
  {
    path: "/courses/newcourse",
    isPrivate: true,
    element: <NewCoursePage />,
  },
  {
    path: "/searchresult/:name",
    isPrivate: true,
    element: <SearchPage />,
  },
  {
    path: "/courses/:courseID/groups/:groupID",
    isPrivate: true,
    element: <GroupDetailPage />,
  },
  {
    path: "/courses/:courseID/groups/:groupID/text-editor",
    isPrivate: true,
    element: <TextEditor />,
  },
];
  
export type AuthRequiredProps = {
  children: React.ReactNode;
  to?: string;
};

export const AuthRequired = ({
  children,
  to = "/auth/login",
}: AuthRequiredProps) => {
  const { isLoggedIn } = useAuth();
  const { pathname, search } = useLocation();
  
  if (!isLoggedIn && pathname !== to) {
    return <Navigate to={to} state={{ from: search }} replace />;
  }
  return <>{children}</>;
};

const renderRouteMap = ({ isPrivate, element, ...restRoute }: RouteConfig) => {
  const authRequiredElement = isPrivate ? (
    <AuthRequired>{element}</AuthRequired>
  ) : (
    element
  );  
  return (
        <Route key={restRoute.path} element={authRequiredElement} {...restRoute} />
    );
};
  
  export const AppRoutes = () => {
    return <Routes>{routes.map(renderRouteMap)}</Routes>;
  };
  