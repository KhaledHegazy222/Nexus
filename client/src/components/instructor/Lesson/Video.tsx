/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Video = () => {
  const { courseId, lessonId } = useParams();
  const { token } = useAuth();
  const [videoStreamUrl, setVideoStreamUrl] = useState<string | null>(null);

  const [loadFetching, setLoadFetching] = useState(true);
  const [loadUploading, setLoadUploading] = useState(false);
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
    } catch {
      setLoadFetching(false);
    }
    setLoadFetching(false);
  }, [token, courseId, lessonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.files) {
      setLoadFetching(true);
      try {
        const requestBody = new FormData();
        requestBody.append("file", e.target.files[0]);
        await serverAxios.post(
          `/course/${courseId}/video/upload/${lessonId}`,
          requestBody,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
      setLoadFetching(false);
      fetchData();
    }
  };

  return (
    <>
      {loadFetching ? (
        <>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="primary" size={60} />
            <Typography variant="h6">Loading your video.... </Typography>
          </Box>
        </>
      ) : (
        <>
          {videoStreamUrl === null ? (
            <>
              <Typography>
                {"Sorry But it seems like you didn't upload any video yet"}
              </Typography>
            </>
          ) : (
            <>
              <video
                width="500"
                height="600"
                controls
                src={videoStreamUrl}
              ></video>
            </>
          )}
          <Button
            variant="contained"
            component="label"
            sx={{
              m: "20px",
            }}
          >
            Upload Video
            <input
              hidden
              accept="video/*"
              type="file"
              onChange={handleFileUpload}
            />
          </Button>
        </>
      )}
    </>
  );
};

export default Video;
