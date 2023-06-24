import "@fontsource/inter";
import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#187047",
      light: "#4ec18b",
      dark: "#458768",
    },
    secondary: { main: "#fb9002" },
    text: {
      primary: "#373c59",
      secondary: "#fff",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default lightTheme;
