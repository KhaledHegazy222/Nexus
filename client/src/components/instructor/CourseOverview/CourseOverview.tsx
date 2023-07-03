import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { GeneralInfoType } from "../CreateCourse/GeneralInfo";
import { RequirementsType } from "../CreateCourse/Requirements";
import { Box, List, ListItem, Typography } from "@mui/material";
import { ArrowRight } from "@mui/icons-material";
import CourseImage from "@/assets/images/course.jpg";

import TableOfContent from "./TableOfContent";
type CourseValueType = GeneralInfoType & RequirementsType;

const CourseInitialValue: CourseValueType = {
  title: "Learn Python in Three Seconds",
  description:
    "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
  field: "Software",
  level: "Beginner",
  price: 11,
  requirements: [
    "You Have to know C/C++",
    "You must be an expert competitive programmer on Codeforces",
  ],
};

const CourseOverview = () => {
  const { id } = useParams();

  const [courseData, setCourseData] =
    useState<CourseValueType>(CourseInitialValue);

  return (
    <>
      <Box
        sx={{
          margin: "30px",
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
        <TableOfContent />
      </Box>
    </>
  );
};

export default CourseOverview;
