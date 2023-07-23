import { Route, Routes } from "react-router-dom";
import Dashboard from "./MyCourses";
import CoursePage from "./Course";

import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import {
  StyledContentContainer,
  StyledLayoutPage,
  StyledPaper,
} from "@/components/Layout.styled";

const Instructor = () => {
  return (
    <>
      <StyledLayoutPage>
        <DashboardNavbar />
        <StyledContentContainer>
          <StyledPaper>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/course/*" element={<CoursePage />} />
            </Routes>
          </StyledPaper>
        </StyledContentContainer>
      </StyledLayoutPage>
    </>
  );
};

export default Instructor;
