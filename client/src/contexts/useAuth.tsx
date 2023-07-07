import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthValueType = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthValueType>({
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [setToken]);
  const value = {
    token,
    setToken,
  };
  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
