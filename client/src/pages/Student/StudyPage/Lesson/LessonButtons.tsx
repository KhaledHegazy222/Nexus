/* eslint-disable */
import useAuth from "@/contexts/useAuth";
import { useCourse } from "@/contexts/useCourse";
import { serverAxios } from "@/utils/axios";
import { CheckCircle } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  completed: boolean;
  toggleCompleted: () => void;
};
const LessonButtons: FC<Props> = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { lessonId, courseId } = useParams();
  const { courseData, refresh } = useCourse();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const completed = currentLesson?.completed || false;
  const [isLoading, setIsLoading] = useState(false);
  const [nextAllowed, setNextAllowed] = useState(true);
  const [previousAllowed, setPreviousAllowed] = useState(true);

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
  };
  useEffect(() => {
    const serializeLessons = courseData.content.reduce(
      (serializedData, currentWeek) => {
        return [...serializedData, ...currentWeek.content];
      },
      [] as Lesson[]
    );
    const index = serializeLessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (index === 0) setPreviousAllowed(false);
    if (index === serializeLessons.length - 1) setNextAllowed(false);
    if (index === -1) {
      throw new Error("Invalid Lesson Url");
    }
    const foundLesson = serializeLessons[index];
    setCurrentLesson(foundLesson ?? null);
  }, [courseData, lessonId]);

  const handlePrevious = () => {
    const serializeLessons = courseData.content.reduce(
      (serializedData, currentWeek) => {
        return [...serializedData, ...currentWeek.content];
      },
      [] as Lesson[]
    );
    const index = serializeLessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (index <= 0) return;
    navigate(
      `/student/course/${courseId}/${serializeLessons[index - 1].type}/${
        serializeLessons[index - 1].id
      }`
    );
  };
  const handleNext = () => {
    const serializeLessons = courseData.content.reduce(
      (serializedData, currentWeek) => {
        return [...serializedData, ...currentWeek.content];
      },
      [] as Lesson[]
    );
    const index = serializeLessons.findIndex(
      (lesson) => lesson.id === lessonId
    );
    if (index === -1 || index + 1 === serializeLessons.length) return;
    navigate(
      `/student/course/${courseId}/${serializeLessons[index + 1].type}/${
        serializeLessons[index + 1].id
      }`
    );
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        disabled={!previousAllowed}
        onClick={handlePrevious}
      >
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
      <Button
        variant="contained"
        color="primary"
        disabled={!nextAllowed}
        onClick={handleNext}
      >
        Next Lesson
      </Button>
    </Box>
  );
};

export default LessonButtons;
