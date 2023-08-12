import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import lightTheme from "@/theme/light";

import routes from "./pages/routes";
import useAuth from "./contexts/useAuth";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  const { loading } = useAuth();

  console.log(import.meta.env.VITE_API_ROOT_URL);
  console.log(import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID);
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <ToastContainer autoClose={3000} position="top-center" />
        {loading ? (
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={70} />
          </Box>
        ) : (
          routes
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
