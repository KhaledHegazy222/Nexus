/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Button, FormControl } from "@mui/material";
import { Dialog, DialogContent, Input, Typography } from "@mui/material";
import axios from "axios";
import { resolveNaptr, resolveNs } from "dns";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const Video = () => {
  const { courseId, lessonId } = useParams();
  const { token } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    loadData();
    async function loadData() {
      const response = await serverAxios.get(
        `/course/${courseId}/video/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { token: videoToken } = response.data;
      if (videoRef.current) {
        videoRef.current.src = `${
          import.meta.env.VITE_API_ROOT_URL
        }/api/v1/course/video/${lessonId}/${videoToken}`;
      }
    }
  }, [token, courseId, lessonId]);

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.target.files) {
      const requestBody = new FormData();
      requestBody.append("file", e.target.files[0]);
      await serverAxios.post(
        `/course/${courseId}/video/upload/${lessonId}`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  return (
    <>
      <Button variant="contained" component="label">
        Upload
        <input
          hidden
          accept="video/*"
          type="file"
          onChange={handleFileUpload}
        />
      </Button>
      <video ref={videoRef} width="500" height="600" controls>
        <source
          src="blob:http://localhost:3000/b652e450-d927-4ef9-a9cc-bd189f139409"
          type="video/mp4"
        ></source>
      </video>
    </>
  );
};

export default Video;
