import Account from "./Account";
import Home from "./Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Instructor from "./Instructor";
export type pageType = {
  name: string;
  path: string;
  component: JSX.Element;
};

export const pagesData: pageType[] = [
  {
    name: "Home",
    path: "/",
    component: <Home />,
  },
  {
    name: "Account",
    path: "/account/*",
    component: (
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <Account />
      </GoogleOAuthProvider>
    ),
  },
  {
    name: "Instructor",
    path: "/instructor/*",
    component: <Instructor />,
  },
];
