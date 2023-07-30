import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GeneralInfoType } from "../CreateCourse/GeneralInfo";
import {
  RequirementsType,
  WhatYouWillLearnType,
} from "../CreateCourse/ListMultiInput";
import { Box, Fab, List, ListItem, Typography } from "@mui/material";
import { ArrowRight, Edit } from "@mui/icons-material";
import CourseImage from "@/assets/images/course.jpg";

import TableOfContent from "./TableOfContent";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
type CourseValueType = GeneralInfoType &
  RequirementsType &
  WhatYouWillLearnType;

const CourseInitialValue: CourseValueType = {
  title: "Learn Python in Three Seconds",
  description:
    "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
  field: "Software",
  level: "Beginner",
  price: 11,
  requirements: [],
  what_you_will_learn: [],
};

const CourseOverview = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] =
    useState<CourseValueType>(CourseInitialValue);

  useEffect(() => {
    loadData();
    async function loadData() {
      const response = await serverAxios.get(`/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const {
        title,
        level,
        field,
        description,
        requirements,
        price,
        what_you_will_learn,
      } = response.data;
      setCourseData({
        title,
        level,
        field,
        description,
        price: Number(price),
        requirements: requirements.body,
        what_you_will_learn: what_you_will_learn.body,
      });
    }
  }, [id, token]);

  return (
    <>
      <Box
        sx={{
          margin: "30px",
          width: "clamp(300px,100%,1000px)",
        }}
      >
        <Typography variant="h4" textAlign="center">
          {courseData.title}
        </Typography>

        <img
          src={CourseImage}
          style={{
            margin: "30px auto",
            display: "block",
            minWidth: "60%",
            maxWidth: "600px",
          }}
        />
        <Typography variant="h5">Description</Typography>
        <List>
          <ListItem>
            <Typography>{courseData.description}</Typography>
          </ListItem>
        </List>

        <Typography variant="h6">Level</Typography>
        <List>
          <ListItem>
            <Typography>{courseData.level}</Typography>
          </ListItem>
        </List>
        <Typography variant="h6">Field</Typography>
        <List>
          <ListItem>
            <Typography>{courseData.field}</Typography>
          </ListItem>
        </List>

        <Typography variant="h5">Requirements</Typography>
        <List>
          {courseData.requirements.map((requirement) => (
            <ListItem
              key={requirement}
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <ArrowRight />
              <Typography>{requirement}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="h5">What you will learn</Typography>
        <List>
          {courseData.what_you_will_learn.map((learnElem) => (
            <ListItem
              key={learnElem}
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <ArrowRight />
              <Typography>{learnElem}</Typography>
            </ListItem>
          ))}
        </List>
        <TableOfContent />
      </Box>
      <Fab
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
        }}
        color="primary"
        onClick={() => {
          navigate(`/instructor/course/edit/${id}`, {
            state: {
              courseData,
            },
          });
        }}
      >
        <Edit />
      </Fab>
    </>
  );
};

export default CourseOverview;
