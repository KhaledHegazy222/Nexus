import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Box, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LessonButtons from "./LessonButtons";
import { AxiosError } from "axios";

const Video = () => {
  const { token } = useAuth();
  const { courseId, lessonId } = useParams();
  const [completed, setCompleted] = useState(false);
  const [loadFetching, setLoadFetching] = useState(true);
  const [videoStreamUrl, setVideoStreamUrl] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    setLoadFetching(true);
    try {
      const response = await serverAxios.get(
        `/course/${courseId}/video/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { token: videoToken } = response.data;
      setVideoStreamUrl(
        `${
          import.meta.env.VITE_API_ROOT_URL
        }/api/v1/course/video/${lessonId}/${videoToken}`
      );
    } catch (error) {
      console.log((error as AxiosError).message);
    } finally {
      setLoadFetching(false);
    }
    setLoadFetching(false);
  }, [token, courseId, lessonId]);
  const toggleCompleted = () => {
    setCompleted(!completed);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      {loadFetching ? (
        <Box
          sx={{
            width: "100%",
            height: "450px",
            display: "grid",
            placeContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : videoStreamUrl ? (
        <video
          controls
          style={{
            width: "100%",
          }}
        >
          <source src={videoStreamUrl} type="video/mp4" />
        </video>
      ) : (
        <>Something Wrong Happened Please Try again later</>
      )}

      <LessonButtons completed={completed} toggleCompleted={toggleCompleted} />
    </Box>
  );
};

export default Video;
