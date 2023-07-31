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

import { useEffect, useState } from "react";
import { StyledSection, StyledSectionTitle } from "./CourseDetails.styled";
import { StyledLayoutPage } from "@/components/Layout.styled";
import { useParams } from "react-router-dom";
import { serverAxios } from "@/utils/axios";
import TableOfContent from "./TableOfContent";
import Reviews from "./Reviews";
import Navbar from "@/components/Navbar";
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
  const [tableOfContent, setTableOfContent] = useState<Week[]>([]);
  useEffect(() => {
    fetchData();
    async function fetchData() {
      const response = await serverAxios.get(`/course/${courseId}`);
      const {
        title,
        level,
        field,
        price,
        rating,
        description,
        what_you_will_learn: { body: what_you_will_learn },
        requirements: { body: requirements },
        author: { first_name, last_name },
        content,
      } = response.data;

      setCourseData({
        title,
        description,
        level,
        field,
        price,
        requirements,
        whatYouWillLearn: what_you_will_learn,
        rating: Number(rating) || 3.4,
        instructorName: `${first_name} ${last_name}`,
      });
      setTableOfContent(
        content.map(
          (weekElem: {
            id: string;
            title: string;
            content: {
              id: string;
              title: string;
              type: "video" | "reading" | "quiz";
              is_public: boolean;
            }[];
          }): Week => ({
            id: weekElem.id,
            title: weekElem.title,
            lessons: weekElem.content,
          })
        )
      );
    }
  }, [courseId]);

  return (
    <>
      <StyledLayoutPage>
        <Navbar />
        <Box mt="80px" width={"100%"}>
          <StyledSection>
            <StyledSectionTitle>{courseData.title}</StyledSectionTitle>
            <Typography variant="subtitle1">
              {courseData.description}
            </Typography>
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
            <StyledSectionTitle>What you&apos;ll learn</StyledSectionTitle>
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
            <StyledSectionTitle>Table of content</StyledSectionTitle>
            <TableOfContent content={tableOfContent} />
          </StyledSection>
          <StyledSection>
            <StyledSectionTitle>Requirements</StyledSectionTitle>
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
            <StyledSectionTitle>Reviews</StyledSectionTitle>
            <Reviews />
          </StyledSection>
        </Box>
      </StyledLayoutPage>
    </>
  );
};

export default CourseDetails;
