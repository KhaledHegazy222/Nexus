import React from "react";
import Reading from "./Reading";
import Video from "./Video";
import Quiz from "./Quiz";
import { useLocation } from "react-router-dom";

const Lesson = () => {
  const location = useLocation();
  const type = location.state.type as "Video" | "Reading" | "Quiz";
  return type === "Video" ? (
    <Video />
  ) : type === "Reading" ? (
    <Reading />
  ) : (
    <Quiz />
  );
};

export default Lesson;
