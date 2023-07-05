import {
  Box,
  Button,
  FormControl,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
const Reading = () => {
  const { courseId, lessonId } = useParams();

  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(
    "<h1>asdadsasdsd</h1><ol><li>asdadsasdsd</li><li>123</li><li>wqdas</li></ol><p><br></p>"
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          padding: "30px",
          height: "100%",
          width: "100%",
        }}
      >
        {editMode ? (
          <>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              style={{
                width: "clamp(400px,100%,800px)",
                margin: "30px",
              }}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={() => setEditMode(false)}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Paper
              sx={{
                padding: "10px",
                flex: "1",
                width: "100%",
                border: "1px solid black",
              }}
            >
              {ReactHtmlParser(value)}
            </Paper>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default Reading;
