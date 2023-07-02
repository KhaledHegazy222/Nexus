import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./MyCourses";
import CoursePage from "./Course";
import { Box, Paper } from "@mui/material";
import DashboardNavbar from "@/components/instructor/Navbar";
import {
  StyledContentContainer,
  StyledLayoutPage,
  StyledPaper,
} from "@/components/instructor/Layout.styled";

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
