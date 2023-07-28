/* eslint-disable */
import useAuth from "@/contexts/useAuth";
import { useCourse } from "@/contexts/useCourse";
import { serverAxios } from "@/utils/axios";
import { CheckCircle } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type studentLessonType = {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  completed: boolean;
};

type Props = {
  completed: boolean;
  toggleCompleted: () => void;
};
const LessonButtons: FC<Props> = () => {
  const { token } = useAuth();
  const { lessonId, courseId } = useParams();
  const { courseData, refresh } = useCourse();
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleCompleted = async () => {
    try {
      setIsLoading(true);
      await serverAxios.post(
        `/course/${courseId}/lesson/${lessonId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refresh();
    } catch {
      /* error */
    } finally {
      setIsLoading(false);
    }
    setCompleted((state) => !state);
  };
  useEffect(() => {
    const serializeLessons = courseData.content.reduce(
      (serializedData, currentWeek) => {
        return [...serializedData, ...currentWeek.content];
      },
      [] as {
        id: string;
        title: string;
        type: "video" | "reading" | "quiz";
        completed: boolean;
      }[]
    );

    const currentLesson = serializeLessons.find(
      (lesson) => lesson.id === lessonId
    )!;
    setCompleted(currentLesson.completed);
  }, [courseData, lessonId]);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button variant="contained" color="secondary">
        Previous Lesson
      </Button>
      <Button
        disabled={completed}
        variant={"contained"}
        onClick={toggleCompleted}
        sx={{
          textTransform: "none",
        }}
      >
        {isLoading ? (
          <CircularProgress
            size={20}
            sx={{
              color: "white",
            }}
          />
        ) : completed ? (
          <>
            <CheckCircle
              sx={{
                marginRight: "10px",
                fontSize: "1.4rem",
              }}
            />
            Completed
          </>
        ) : (
          "Mark as Completed"
        )}
      </Button>
      <Button variant="contained" color="primary">
        Next Lesson
      </Button>
    </Box>
  );
};

export default LessonButtons;
