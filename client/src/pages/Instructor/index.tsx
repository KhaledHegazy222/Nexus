import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import CoursePage from "./Course";

const Instructor = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/course/*" element={<CoursePage />} />
    </Routes>
  );
};

export default Instructor;
