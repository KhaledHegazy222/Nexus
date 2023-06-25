import { CssBaseline, ThemeProvider } from "@mui/material";
import lightTheme from "@/theme/light";

import routes from "./pages/routes";

function App() {
  return (
    <>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {routes}
      </ThemeProvider>
    </>
  );
}

export default App;
