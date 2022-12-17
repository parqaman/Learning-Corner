import {
    Navigate,
    Route,
    RouteProps,
    Routes,
    useLocation,
  } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
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
  console.log(pathname);
  
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
  