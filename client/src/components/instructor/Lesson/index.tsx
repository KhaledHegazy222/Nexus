import React from "react";
import Reading from "./Reading";
import Video from "./Video";
import Quiz from "./Quiz";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button } from "@mui/material";

const Lesson = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  return (
    <>
      <Button onClick={() => navigate(`/instructor/course/${courseId}`)}>
        Back to course overview
      </Button>
      <Routes>
        <Route path="/video/:lessonId" element={<Video />} />
        <Route path="/reading/:lessonId" element={<Reading />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
      </Routes>
    </>
  );
};

export default Lesson;
