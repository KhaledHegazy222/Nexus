import About from "@/components/Landing Page/About";
import Hero from "@/components/Landing Page/Hero";
import Navbar from "@/components/Navbar";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const activationCode = params.get("activate");

  useEffect(() => {
    if (activationCode) {
      activateAccount(activationCode);
    }

    async function activateAccount(code: string) {
      try {
        const response = await serverAxios.patch(`/auth/verify?token=${code}`);
        setToken(response.data.token);
        toast.success("Your Account has been activated Successfully");
      } catch {
        /* empty */
      }
    }
  }, [activationCode]);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
    </>
  );
};

export default Home;
