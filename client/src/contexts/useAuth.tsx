import { serverAxios } from "@/utils/axios";
import { AxiosError } from "axios";
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
  setToken: () => {},
  user: null,
  loading: true,
  logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  }, [setToken, navigate]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [setToken]);
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const response = await serverAxios.get("/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { id, first_name, last_name, mail, role, bio, contacts } =
          response.data;
        if (role === "admin") {
          setUser({
            id: Number(id),
            first_name,
            last_name,
            role,
            mail,
            bio,
            contacts,
          });
        } else {
          setUser({ id: Number(id), first_name, last_name, role, mail });
        }
      } catch (error) {
        console.log((error as AxiosError).message);
      }

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
