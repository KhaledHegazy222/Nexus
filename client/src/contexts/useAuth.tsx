import { serverAxios } from "@/utils/axios";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthValueType = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: User | null;
  loading: boolean;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthValueType>({
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
  user: null,
  loading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

type User = {
  first_name: string;
  last_name: string;
  mail: string;
  role: "student" | "admin";
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  }, [setToken, navigate]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [setToken]);
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token, setToken]);
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await serverAxios.get("/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { first_name, last_name, mail, role } = response.data;
      setUser({
        first_name,
        last_name,
        role,
        mail,
      });
      setLoading(false);
    }
    if (token) {
      loadData();
    } else if (!token && !localStorage.getItem("token")) {
      setLoading(false);
      setUser(null);
    }
  }, [token]);
  const value = useMemo(
    () => ({
      token,
      setToken,
      user,
      loading,
      logout,
    }),
    [token, setToken, user, loading, logout]
  );
  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
