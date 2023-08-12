import useAuth from "@/contexts/useAuth";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent: FC) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    useEffect(() => {
      if (user === null) navigate("/account/login");
    }, [user, navigate]);
    return <WrappedComponent />;
  };
};

export default withAuth;
