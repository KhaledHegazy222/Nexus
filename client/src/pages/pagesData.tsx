import Account from "./Account";
import Home from "./Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Account />
      </GoogleOAuthProvider>
    ),
  },
];
