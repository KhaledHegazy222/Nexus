import Reading from "./Reading";
import Video from "./Video";
import Quiz from "./Quiz";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { West } from "@mui/icons-material";

const Lesson = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  return (
    <>
      <Button
        variant="contained"
        onClick={() => navigate(`/instructor/course/${courseId}`)}
        sx={{
          marginTop: "30px",
          marginLeft: "30px",
          marginRight: "auto",
          display: "flex",
          gap: "10px",
        }}
      >
        <West />
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
