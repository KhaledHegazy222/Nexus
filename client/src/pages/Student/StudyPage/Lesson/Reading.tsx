import { Paper } from "@mui/material";
import { useState } from "react";
import LessonButtons from "./LessonButtons";

const textInitialValue: string =
  '<h1>Lesson Title</h1><h2><strong>Lesson Subtitle </strong></h2><p>Lesson paragraph</p><p><br></p><h3>Main topics</h3><ol><li>Topic one</li><li>Topic two</li><li>Topic three</li><li>Topic four</li></ol><h3><strong>Reference:</strong></h3><ul><li><a href="https://www.wikipedia.org/" rel="noopener noreferrer" target="_blank">Wikipedia</a></li><li><a href="https://www.youtube.com/" rel="noopener noreferrer" target="_blank">Video Playlist</a></li></ul>';

const Reading = () => {
  const [text] = useState(textInitialValue);

  const [completed, setCompleted] = useState(false);
  const toggleCompleted = () => {
    setCompleted(!completed);
  };
  return (
    <>
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
      <LessonButtons completed={completed} toggleCompleted={toggleCompleted} />
    </>
  );
};

export default Reading;
