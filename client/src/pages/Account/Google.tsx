import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Box } from "@mui/material";
import {
  GoogleLogin as ContinueWithGoogle,
  CredentialResponse,
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
const GoogleLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const response = await serverAxios.post(
      "/auth/oauth/google",
      {},
      {
        headers: { Authorization: credentialResponse.credential },
      }
    );
    setToken(response.data.token);
    navigate("/");
  };
  const handleError = () => {
    console.log("Something went Wrong!");
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ContinueWithGoogle onSuccess={handleSuccess} onError={handleError} />
    </Box>
  );
};

export default GoogleLogin;
