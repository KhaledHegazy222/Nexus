import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { CheckCircle, } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Video = () => {
  const { token } = useAuth();
  const { courseId, lessonId } = useParams();
  // const [videoSrc, setVideoSrc] = useState<string | null>(null);
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
          variant={completed ? "contained" : "outlined"}
          onClick={toggleCompleted}
          sx={{
            textTransform: "none",
          }}
        >
          {completed ? (
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
    </Box>
  );
};

export default Video;
