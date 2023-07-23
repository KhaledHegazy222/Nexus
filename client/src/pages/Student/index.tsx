import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import {
  StyledContentContainer,
  StyledLayoutPage,
  StyledPaper,
} from "@/components/Layout.styled";
import { Route, Routes } from "react-router-dom";
import MyCourses from "./MyCourses";
import StudyPage from "./StudyPage";

const Student = () => {
  return (
    <StyledLayoutPage>
      <DashboardNavbar />
      <StyledContentContainer>
        <StyledPaper>
          <Routes>
            <Route path="/" element={<MyCourses />} />
            <Route path="/course/:courseId/*" element={<StudyPage />} />
          </Routes>
        </StyledPaper>
      </StyledContentContainer>
    </StyledLayoutPage>
  );
};

export default Student;
