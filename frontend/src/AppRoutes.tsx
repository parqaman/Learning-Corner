import {
    Navigate,
    Route,
    RouteProps,
    Routes,
    useLocation,
  } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
  
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
];
  
const renderRouteMap = ({ isPrivate, ...restRoute }: RouteConfig) => {
    return (
        <Route key={restRoute.path} {...restRoute} />
    );
};
  
  export const AppRoutes = () => {
    return <Routes>{routes.map(renderRouteMap)}</Routes>;
  };
  