import Account from "./Account";
import Home from "./Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Instructor from "./Instructor";
import Explore from "./Explore";
import Student from "./Student";
import CourseDetails from "./CourseDetails";
import Admin from "./Admin";
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
  {
    name: "Student",
    path: "/student/*",
    component: <Student />,
  },
  {
    name: "Explore",
    path: "/explore",
    component: <Explore />,
  },
  {
    name: "Course Details",
    path: "/course/:courseId",
    component: <CourseDetails />,
  },
  {
    name: "Admin",
    path: "/admin",
    component: <Admin />,
  },
];
