import { Box } from "@mui/material";
import {
  GoogleLogin as ContinueWithGoogle,
  CredentialResponse,
} from "@react-oauth/google";
import axios from "axios";
const GoogleLogin = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ContinueWithGoogle
        onSuccess={async (credentialResponse: CredentialResponse) => {
          axios.post(
            `${import.meta.env.VITE_API_ROOT_URL}/api/v1/oauth/google`,
            {},
            {
              headers: { Authorization: credentialResponse.credential },
            }
          );
        }}
        onError={() => {
          console.log("Failed");
        }}
      />
    </Box>
  );
};

export default GoogleLogin;
