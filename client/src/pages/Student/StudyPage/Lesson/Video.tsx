import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Box } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LessonButtons from "./LessonButtons";

const Video = () => {
  const { token } = useAuth();
  const { courseId, lessonId } = useParams();
  const [completed, setCompleted] = useState(false);
  const toggleCompleted = () => {
    setCompleted(!completed);
  };

  useEffect(() => {
    loadData();

    async function loadData() {
      try {
        const response = await serverAxios.get(
          `/course/${courseId}/video/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log((error as AxiosError).message);
      }
    }
  }, [courseId, lessonId, token]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <video
        controls
        style={{
          width: "100%",
        }}
      >
        <source
          src="http://techslides.com/demos/sample-videos/small.mp4"
          type="video/mp4"
        />
      </video>
      <LessonButtons completed={completed} toggleCompleted={toggleCompleted} />
    </Box>
  );
};

export default Video;
