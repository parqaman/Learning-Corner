import {
    Navigate,
    Route,
    RouteProps,
    Routes,
    useLocation,
  } from "react-router-dom";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MyCoursesPage } from "./pages/MyCoursesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
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
    path: "/courses/:id",
    isPrivate: true,
    element: <CourseDetailPage />,
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
  