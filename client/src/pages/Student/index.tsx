import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import {
  StyledContentContainer,
  StyledLayoutPage,
  StyledPaper,
} from "@/components/Layout.styled";
import { Route, Routes } from "react-router-dom";
import MyCourses from "./MyCourses";

const Student = () => {
  return (
    <StyledLayoutPage>
      <DashboardNavbar />
      <StyledContentContainer>
        <StyledPaper>
          <Routes>
            <Route path="/" element={<MyCourses />} />
          </Routes>
        </StyledPaper>
      </StyledContentContainer>
    </StyledLayoutPage>
  );
};

export default Student;
