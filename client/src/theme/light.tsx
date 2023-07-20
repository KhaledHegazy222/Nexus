import "@fontsource/inter";
import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#187047",
      light: "#eef9f6",
      dark: "#458768",
    },
    secondary: { main: "#fb9002", light: "#ffbd66" },
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
