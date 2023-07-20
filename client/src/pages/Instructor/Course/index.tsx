import { Route, Routes } from "react-router-dom";
import CreateCourse from "./Create";
import CourseOverview from "./Overview";
import Lesson from "@/components/instructor/Lesson";

const CoursePage = () => {
  return (
    <Routes>
      <Route path="/new" element={<CreateCourse />} />
      <Route path="/edit/:id" element={<CreateCourse edit />} />
      <Route path="/:id" element={<CourseOverview />} />
      <Route path="/:courseId/*" element={<Lesson />} />
    </Routes>
  );
};

export default CoursePage;
