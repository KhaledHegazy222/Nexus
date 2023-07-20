import { Adjust, Check } from "@mui/icons-material";
import {
  Box,
  ListItem,
  Rating,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { StyledSection } from "./CourseDetails.styled";
import { StyledLayoutPage } from "@/components/instructor/Layout.styled";
type CourseValueType = {
  title: string;
  description: string;
  field: string;
  level: string;
  rating: number;
  instructorName: string;
  price: number;
  requirements: string[];
  whatYouWillLearn: string[];
};

const CourseInitialValue: CourseValueType = {
  title: "Learn Python in Three Seconds",
  description:
    "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
  field: "Software",
  level: "Beginner",
  rating: 3.5,
  instructorName: "Omar El-Sayed",
  price: 11,
  requirements: [
    "You Have to know C/C++",
    "You must be an expert competitive programmer on Codeforces",
  ],
  whatYouWillLearn: [
    "You Have to know C/C++",
    "You must be an expert competitive programmer on Codeforces",
  ],
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] =
    useState<CourseValueType>(CourseInitialValue);

  return (
    <>
      <StyledLayoutPage>
        <StyledSection>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "600",
            }}
          >
            {courseData.title}
          </Typography>
          <Typography variant="subtitle1">{courseData.description}</Typography>
          <Typography
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: "600",
            }}
          >
            Created By:
          </Typography>{" "}
          <Typography
            component="span"
            sx={{
              color: "gray",
            }}
          >
            {courseData.instructorName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            <Typography>{courseData.rating}</Typography>
            <Rating value={courseData.rating} precision={0.1} readOnly />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
            }}
          >{`${courseData.price} EGP`}</Typography>
          <Button
            variant="contained"
            sx={{
              display: "block",
              m: "auto",
            }}
          >
            Enroll Now
          </Button>
        </StyledSection>
        <StyledSection>
          <Typography>What you&apos;ll learn</Typography>
          <List>
            {courseData.whatYouWillLearn.map((elem) => (
              <ListItem key={elem} disablePadding>
                <ListItemIcon
                  sx={{
                    minWidth: "unset",
                    p: "5px",
                    marginRight: "10px",
                  }}
                >
                  <Check />
                </ListItemIcon>
                <ListItemText>{elem}</ListItemText>
              </ListItem>
            ))}
          </List>
        </StyledSection>
        <StyledSection>
          <Typography>Table of content</Typography>
        </StyledSection>
        <StyledSection>
          <Typography>Requirements</Typography>
          <List>
            {courseData.requirements.map((elem) => (
              <ListItem key={elem} disablePadding>
                <ListItemIcon
                  sx={{
                    minWidth: "unset",
                    p: "5px",
                    marginRight: "10px",
                  }}
                >
                  <Adjust />
                </ListItemIcon>
                <ListItemText>{elem}</ListItemText>
              </ListItem>
            ))}
          </List>
        </StyledSection>
        <StyledSection>
          <Typography>Reviews</Typography>
        </StyledSection>
      </StyledLayoutPage>
    </>
  );
};

export default CourseDetails;
