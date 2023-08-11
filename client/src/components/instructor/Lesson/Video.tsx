import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const abortController = new AbortController();
const Video = () => {
  const { lessonId } = useParams();
  const { token } = useAuth();
  const [videoStreamUrl, setVideoStreamUrl] = useState<string | null>(null);

  const [loadFetching, setLoadFetching] = useState(true);
  const [loadUploading, setLoadUploading] = useState(false);
  const [uploadedPercentage, setUploadedPercentage] = useState(0);
  const fetchData = useCallback(async () => {
    setLoadFetching(true);
    try {
      const response = await serverAxios.get(
        `/lesson/video/${lessonId}/token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { token: videoToken } = response.data;
      setVideoStreamUrl(
        `${
          import.meta.env.VITE_API_ROOT_URL
        }/api/v1/lesson/video/${lessonId}?token=${videoToken}`
      );
    } finally {
      setLoadFetching(false);
    }
    setLoadFetching(false);
  }, [token, lessonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.files) {
      setLoadUploading(true);
      try {
        const requestBody = new FormData();
        requestBody.append("file", e.target.files[0]);
        await serverAxios.post(`/lesson/video/${lessonId}`, requestBody, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            setUploadedPercentage(
              Math.round((100 * event.loaded) / event.total!)
            );
          },
          signal: abortController.signal,
        });
        await fetchData();
      } catch (error) {
        console.log(error);
      }
      setLoadUploading(false);
    }
  };

  return (
    <>
      {loadUploading ? (
        <Box
          sx={{
            mt: "30px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Typography variant="h4" sx={{ fontSize: "2.5rem" }}>
            Uploading Your Video...
          </Typography>
          <Typography variant="subtitle1" color="red" fontWeight="600">
            Don&apos;t Close This Page
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "primary.main",
            }}
          >{`${uploadedPercentage}%`}</Typography>
          <LinearProgress
            variant="determinate"
            value={uploadedPercentage}
            color="primary"
            sx={{
              m: "10px",
              width: "clamp(260px,70%,1200px)",
              height: "10px",
              borderRadius: "10px",
            }}
          />
          <Button
            color="error"
            variant="contained"
            onClick={() => abortController.abort()}
          >
            Cancel
          </Button>
        </Box>
      ) : loadFetching ? (
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
              <video width="500" height="600" controls>
                <source src={videoStreamUrl} type="video/mp4"></source>
              </video>
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
