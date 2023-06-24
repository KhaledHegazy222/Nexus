import { CssBaseline, ThemeProvider } from "@mui/material";
import lightTheme from "@/theme/light";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />

        <Navbar />
        <Hero />
      </ThemeProvider>
    </>
  );
}

export default App;
