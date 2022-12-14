import {
    Navigate,
    Route,
    RouteProps,
    Routes,
  } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
  
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
  
//TODO: if user is not yet logged, navigate directly to login page, otherwise to index page
const renderRouteMap = ({ isPrivate, element, ...restRoute }: RouteConfig) => {
    return (
        <Route key={restRoute.path} {...restRoute} />
    );
};
  
  export const AppRoutes = () => {
    return <Routes>{routes.map(renderRouteMap)}</Routes>;
  };
  