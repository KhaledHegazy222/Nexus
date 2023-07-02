import { Route, Routes } from "react-router-dom";
import CreateCourse from "./Create";
import CourseOverview from "./Overview";

const CoursePage = () => {
  return (
    <Routes>
      <Route path="/new" element={<CreateCourse />} />
      <Route path="/:id" element={<CourseOverview />} />
    </Routes>
  );
};

export default CoursePage;
