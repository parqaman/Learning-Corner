import React, { createContext, useContext } from "react";
import { useToast, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/localStorage";

export type LoginData = {
  password: string;
  email: string;
};

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
};

export type AuthContext = {
  accessToken: string;
  user: User | null;
  isLoggedIn: boolean;
  actions: {
    login: (loginData: LoginData) => void;
    logout: () => void;
  };
};

export const authContext = React.createContext<AuthContext | null>(null);

export type AuthProviderProps = { children: React.ReactNode };
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>(
    "accessToken",
    null
  );

  const user = React.useMemo(
    () =>
      accessToken
        ? (JSON.parse(atob(accessToken.split(".")[1])) as User)
        : null,
    [accessToken]
  );
  const toast = useToast();
  const navigate = useNavigate();

  const onLogout = React.useCallback(() => {
    setAccessToken(null);
    navigate("/");
  }, []);

  const onLogin = React.useCallback(
    async (loginData: LoginData) => {
      console.log("now logging in");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: { "content-type": "application/json" },
      });

      const resBody = await res.json();
      if (res.status === 200) {
        setAccessToken(resBody.accessToken);
        navigate("/", { replace: true });
      } else {
        toast({
          title: "Error occured.",
          description: (
            <>
              {resBody.errors.map((e: string) => (
                <Text key={e}>{e}</Text>
              ))}
            </>
          ),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
    [toast]
  );
  return (
    <authContext.Provider
      value={{
        accessToken,
        user,
        isLoggedIn: !!user,
        actions: {
          login: onLogin,
          logout: onLogout,
        },
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(authContext);
  if (!contextValue) {
    throw new Error("ensure to use useAuth within its provider");
  }
  return contextValue;
};
