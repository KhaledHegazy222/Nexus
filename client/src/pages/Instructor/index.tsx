import { Route, Routes } from "react-router-dom";
import Dashboard from "./MyCourses";
import CoursePage from "./Course";

import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import {
  StyledContentContainer,
  StyledLayoutPage,
  StyledPaper,
} from "@/components/Layout.styled";
import Profile from "./Profile";

const Instructor = () => {
  return (
    <>
      <StyledLayoutPage>
        <DashboardNavbar />
        <StyledContentContainer>
          <StyledPaper elevation={10}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course/*" element={<CoursePage />} />
              <Route path="/profile/:userId" element={<Profile />} />
            </Routes>
          </StyledPaper>
        </StyledContentContainer>
      </StyledLayoutPage>
    </>
  );
};

export default Instructor;
