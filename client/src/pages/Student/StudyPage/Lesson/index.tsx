/* eslint-disable */
import { Route, Routes } from "react-router-dom";
import Quiz from "./Quiz";
import Reading from "./Reading";
import Video from "./Video";
import { Box, CircularProgress } from "@mui/material";
import { useCourse } from "@/contexts/useCourse";
import NoLesson from "./NoLesson";

const Lesson = () => {
  const { isLoading } = useCourse();

  return (
    <Box
      sx={{
        width: "100%",
        padding: "10px",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Routes>
          <Route path="/" element={<NoLesson />} />
          <Route path="/video/:lessonId" element={<Video />} />
          <Route path="/reading/:lessonId" element={<Reading />} />
          <Route path="/quiz/:lessonId" element={<Quiz />} />
        </Routes>
      )}
    </Box>
  );
};

export default Lesson;
