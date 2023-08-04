import "@fontsource/inter";
import { createTheme } from "@mui/material";


// #cdbae9
const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#5c1cac",
      light: "#9362d0",
      dark: "#4f346f",
    },
    secondary: { main: "#d09362", light: "#e4c1a5" },
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
