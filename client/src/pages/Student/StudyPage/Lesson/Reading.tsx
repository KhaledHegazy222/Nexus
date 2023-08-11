import { Box, CircularProgress, Paper } from "@mui/material";
import { FC, useEffect, useState } from "react";
import LessonButtons from "./LessonButtons";
import { useParams } from "react-router-dom";
import { serverAxios } from "@/utils/axios";
import useAuth from "@/contexts/useAuth";
import { LessonProps } from ".";
import { AxiosError } from "axios";

const textInitialValue: string =
  '<h1>Lesson Title</h1><h2><strong>Lesson Subtitle </strong></h2><p>Lesson paragraph</p><p><br></p><h3>Main topics</h3><ol><li>Topic one</li><li>Topic two</li><li>Topic three</li><li>Topic four</li></ol><h3><strong>Reference:</strong></h3><ul><li><a href="https://www.wikipedia.org/" rel="noopener noreferrer" target="_blank">Wikipedia</a></li><li><a href="https://www.youtube.com/" rel="noopener noreferrer" target="_blank">Video Playlist</a></li></ul>';

const Reading: FC<LessonProps> = ({ setShowUnFreeError }) => {
  const { lessonId } = useParams();
  const { token } = useAuth();
  const [text, setText] = useState(textInitialValue);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const toggleCompleted = () => {
    setCompleted(!completed);
  };
  useEffect(() => {
    loadData();
    async function loadData() {
      try {
        setLoading(true);
        const response = await serverAxios.get(`/lesson/reading/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setText(response.data.content);
        setShowUnFreeError(false);
      } catch (error) {
        console.log((error as AxiosError).message);
        setShowUnFreeError(true);
      } finally {
        setLoading(false);
      }
    }
  }, [token, lessonId, setShowUnFreeError]);
  return (
    <>
      {loading ? (
        <Box
          sx={{
            height: "480px",
            display: "grid",
            placeContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          dangerouslySetInnerHTML={{
            __html: text,
          }}
          sx={{
            padding: "10px",
            margin: "10px",
            height: "480px",
            overflow: "auto",
          }}
        ></Paper>
      )}

      <LessonButtons completed={completed} toggleCompleted={toggleCompleted} />
    </>
  );
};

export default Reading;
