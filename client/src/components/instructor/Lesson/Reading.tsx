import { Box, Button, Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { serverAxios } from "@/utils/axios";
import useAuth from "@/contexts/useAuth";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReadingContentInitialValue = `<h1>Lesson Title</h1><h2><strong>Lesson Subtitle </strong></h2><p>Lesson paragraph</p><h3>Main topics</h3><ol><li>Topic one</li><li>Topic two</li><li>Topic three</li><li>Topic four</li></ol><h3><strong>Reference:</strong></h3><ul><li><a href="https://www.wikipedia.org/" rel="noopener noreferrer" target="_blank">Wikipedia</a></li><li><a href="https://www.youtube.com/" rel="noopener noreferrer" target="_blank">Video Playlist</a></li></ul>`;

const Reading = () => {
  const { courseId, lessonId } = useParams();
  const { token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(ReadingContentInitialValue);

  const loadData = useCallback(async () => {
    try {
      const response = await serverAxios.get(
        `/course/${courseId}/reading/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setValue(response.data.content);
    } catch {
      /* empty */
    }
  }, [courseId, lessonId, token]);

  const handleSave = () => {
    const regex = /(<p><br><\/p>)+/g;
    const filterValue = value.replace(regex, "<p><br></p>");

    try {
      serverAxios.post(
        `/course/${courseId}/reading/${lessonId}`,
        {
          content: filterValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setValue(filterValue);
      setEditMode(false);
    } catch {
      /* empty */
    }
  };
  const handleCancel = () => {
    loadData();
    setEditMode(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

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
            <Box>
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
                m: "20px",
              }}
            >
              <Button color="primary" variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button color="error" variant="contained" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Paper
              sx={{
                padding: "10px",
                flex: "1",
                width: "100%",
                border: "1px solid black",
                "& p": {
                  display: "flex",
                },
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: value,
                }}
              ></div>
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
