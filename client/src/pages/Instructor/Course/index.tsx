import { Route, Routes } from "react-router-dom";
import CreateCourse from "./Create";
import CourseOverview from "./Overview";
import Lesson from "@/components/instructor/Lesson";

const CoursePage = () => {
  return (
    <Routes>
      <Route path="/new" element={<CreateCourse />} />
      <Route path="/:id" element={<CourseOverview />} />
      <Route path="/:courseId/lesson/:lessonId" element={<Lesson />} />
    </Routes>
  );
};

export default CoursePage;
