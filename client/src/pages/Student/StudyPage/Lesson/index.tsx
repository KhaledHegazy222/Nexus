import { Route, Routes } from "react-router-dom";
import Quiz from "./Quiz";
import Reading from "./Reading";
import Video from "./Video";
import { Box } from "@mui/material";

const Lesson = () => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "10px",
      }}
    >
      <Routes>
        <Route path="/" element={<>No Lesson</>} />
        <Route path="/video/:lessonId" element={<Video />} />
        <Route path="/reading/:lessonId" element={<Reading />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
      </Routes>
    </Box>
  );
};

export default Lesson;
