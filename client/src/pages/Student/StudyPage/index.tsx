import { Box, Typography } from "@mui/material";
import Lesson from "./Lesson";
import { Route, Routes, useParams } from "react-router-dom";
import LessonProvider from "@/contexts/useCourse";
import Sidebar from "./Sidebar";

const StudyPage = () => {
  const { courseId } = useParams();

  return (
    <LessonProvider courseId={courseId!}>
      <Typography variant="h4" sx={{ marginTop: "30px", marginBottom: "60px" }}>
        Course Content
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          margin: "20px 0",
        }}
      >
        <Routes>
          <Route path="/video/:lessonId?" element={<Sidebar />} />
          <Route path="/reading/:lessonId?" element={<Sidebar />} />
          <Route path="/quiz/:lessonId?" element={<Sidebar />} />
          <Route path="/" element={<Sidebar />} />
        </Routes>
        <Lesson />
      </Box>
    </LessonProvider>
  );
};

export default StudyPage;
