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
  Avatar,
} from "@mui/material";

import { useEffect, useState } from "react";
import { StyledSection, StyledSectionTitle } from "./CourseDetails.styled";
import { StyledLayoutPage } from "@/components/Layout.styled";
import { Link, useParams } from "react-router-dom";
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
  instructorId?: number;
  instructorName: string;
  bio?: string;
  image?: string | null;
  price: number;
  requirements: string[];
  whatYouWillLearn: string[];
  discount?: number;
  discount_last_date?: string;
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<Partial<CourseValueType>>({});
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
        author: { first_name, last_name, bio, image, id },
        content,
        discount,
        discount_last_date,
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
        bio,
        image,
        instructorId: id,
        discount: Number(discount),
        discount_last_date,
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
  console.log(courseData.discount);

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
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Typography
                sx={{ color: "#faaf00", fontWeight: "600", fontSize: "1.1rem" }}
              >
                {courseData.rating}
              </Typography>
              <Rating
                value={courseData.rating ?? 3.4}
                precision={0.1}
                readOnly
              />
            </Box>
            {courseData.discount ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "600",
                    }}
                  >{`${(
                    ((100 - courseData.discount) / 100) *
                    Number(courseData?.price)
                  ).toFixed(2)} EGP`}</Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                      fontSize: "0.9rem",
                    }}
                  >{`${courseData.price} EGP`}</Typography>
                </Box>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: "20px",
                    color: "primary.main",
                  }}
                >{`This Offer is available until ${new Date(
                  courseData.discount_last_date as string
                ).toLocaleDateString("en-GB")}`}</Typography>
              </>
            ) : (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "600",

                  textAlign: "center",
                  mb: "20px",
                }}
              >{`${courseData.price} EGP`}</Typography>
            )}
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
              {courseData.whatYouWillLearn?.map((elem) => (
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
              {courseData.requirements?.map((elem) => (
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
            <StyledSectionTitle>About Instructor</StyledSectionTitle>

            <Avatar
              sx={{ width: "170px", height: "170px", margin: "auto" }}
              src={`https://nexus-platform-s3.s3.amazonaws.com/image/${courseData.image}`}
              alt={courseData.instructorName}
            />
            <Box sx={{}}>
              <Link
                to={`/instructor/profile/${courseData.instructorId}`}
                style={{
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                {courseData.instructorName}
              </Link>
            </Box>
            <Typography sx={{ color: "#555", p: "10px" }}>
              {courseData.bio}
            </Typography>
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
