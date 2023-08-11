/* eslint-disable */
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Quiz from "./Quiz";
import Reading from "./Reading";
import Video from "./Video";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useCourse } from "@/contexts/useCourse";
import NoLesson from "./NoLesson";
import { useState } from "react";
export type LessonProps = {
  setShowUnFreeError: React.Dispatch<React.SetStateAction<boolean>>;
};

const Lesson = () => {
  const { isLoading } = useCourse();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [showUnFreeError, setShowUnFreeError] = useState<boolean>(false);

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
          <Route
            path="/video/:lessonId"
            element={<Video setShowUnFreeError={setShowUnFreeError} />}
          />
          <Route
            path="/reading/:lessonId"
            element={<Reading setShowUnFreeError={setShowUnFreeError} />}
          />
          <Route
            path="/quiz/:lessonId"
            element={<Quiz setShowUnFreeError={setShowUnFreeError} />}
          />
        </Routes>
      )}
      <Dialog open={showUnFreeError}>
        <DialogTitle>UnFree Lesson</DialogTitle>
        <DialogContent>
          This part of the course can't be viewed without enrolling in the
          course first.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(`/course/${courseId}`)}
          >
            Enroll now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lesson;
