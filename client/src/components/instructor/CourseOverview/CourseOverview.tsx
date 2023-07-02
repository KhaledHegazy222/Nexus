import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { GeneralInfoType } from "../CreateCourse/GeneralInfo";
import { RequirementsType } from "../CreateCourse/Requirements";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  AutoStories,
  AutoStoriesOutlined,
  ExpandLess,
  ExpandMore,
  OndemandVideo,
  OndemandVideoOutlined,
  Quiz,
  QuizOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import CourseImage from "@/assets/images/course.jpg";
import useCollapseList from "@/hooks/useCollapseList";
type CourseValueType = GeneralInfoType & RequirementsType;
type LessonValueType = {
  title: string;
  type: "Video" | "Reading" | "Quiz";
};
type WeekValueType = {
  title: string;
  lessons: LessonValueType[];
};

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

const TableOfContentInitialValue: WeekValueType[] = [
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        title: "Introduction to python programming",
        type: "Video",
      },
      {
        title: "Python Documentations",
        type: "Reading",
      },
      {
        title: "Unit 1 Exercise",
        type: "Quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        title: "Introduction to python programming",
        type: "Video",
      },
      {
        title: "Python Documentations",
        type: "Reading",
      },
      {
        title: "Unit 1 Exercise",
        type: "Quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        title: "Introduction to python programming",
        type: "Video",
      },
      {
        title: "Python Documentations",
        type: "Reading",
      },
      {
        title: "Unit 1 Exercise",
        type: "Quiz",
      },
    ],
  },
];

const CourseOverview = () => {
  const { id } = useParams();

  const [courseData, setCourseData] =
    useState<CourseValueType>(CourseInitialValue);
  const [tableOfContent, setTableOfContent] = useState<WeekValueType[]>(
    TableOfContentInitialValue
  );
  const { listState, toggleCollapse } = useCollapseList(tableOfContent.length);

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

        <Box
          sx={{
            m: "20px 0",
          }}
        >
          <Typography variant="h5" m={"10px 0"}>
            Table Of Content
          </Typography>
          <List>
            {tableOfContent.map((week, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: "0",
                  outline: "1px solid",
                  outlineColor: (theme) => `${theme.palette.primary.main}`,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <ListItemButton
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "primary.light",
                      padding: "10px",
                    }}
                    onClick={() => toggleCollapse(index)}
                  >
                    <Typography variant="h6">{week.title}</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "gray",
                        }}
                      >
                        {week.lessons.length} lesson(s)
                      </Typography>
                      {listState[index] ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  </ListItemButton>

                  <Collapse in={listState[index]}>
                    <List>
                      {week.lessons.map((lesson) => (
                        <ListItemButton
                          key={lesson.title}
                          sx={{
                            gap: "10px",
                          }}
                        >
                          {lesson.type === "Video" ? (
                            <TextSnippetOutlined />
                          ) : lesson.type === "Reading" ? (
                            <AutoStoriesOutlined />
                          ) : (
                            <QuizOutlined />
                          )}
                          <Typography>{lesson.title}</Typography>
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default CourseOverview;
