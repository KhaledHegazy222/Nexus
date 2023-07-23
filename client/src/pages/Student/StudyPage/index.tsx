import { WeekValueType } from "@/components/instructor/CourseOverview/TableOfContent";
import useCollapseList from "@/hooks/useCollapseList";
import {
  CheckCircle,
  ExpandLess,
  ExpandMore,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import Lesson from "./Lesson";
import { useNavigate, useParams } from "react-router-dom";

const TableOfContentInitialValue: WeekValueType[] = [
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: uuid(),
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: uuid(),
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: uuid(),
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: uuid(),
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: uuid(),
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: uuid(),
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: uuid(),
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: uuid(),
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: uuid(),
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: uuid(),
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: uuid(),
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: uuid(),
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: uuid(),
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: uuid(),
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: uuid(),
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
];

const StudyPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [tableOfContent] = useState<WeekValueType[]>(
    TableOfContentInitialValue
  );
  const { listState, toggleCollapse } = useCollapseList(
    tableOfContent.length,
    true
  );
  return (
    <>
      <Typography variant="h4" sx={{ marginTop: "30px", marginBottom: "60px" }}>
        Course Content
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          margin: "20px 0",
        }}
      >
        <List
          sx={{
            borderRight: "1px solid gray",
            padding: "5px",
          }}
        >
          {tableOfContent.map((week, weekIndex) => (
            <>
              <Box mb={"10px"}>
                <ListItemButton
                  key={week.title}
                  onClick={() => toggleCollapse(weekIndex)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemText
                    sx={{
                      whiteSpace: "nowrap",
                      marginRight: "10px",
                      "& span": {
                        fontWeight: "600",
                        fontSize: "1.1rem",
                      },
                    }}
                  >
                    {week.title}
                  </ListItemText>
                  <ListItemIcon
                    sx={{
                      minWidth: "unset",
                    }}
                  >
                    {listState[weekIndex] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemIcon>
                </ListItemButton>
                <Collapse in={listState[weekIndex]}>
                  <Divider />
                  <List>
                    {week.lessons.map((lesson) => (
                      <ListItemButton
                        key={lesson.id}
                        onClick={() => {
                          navigate(
                            `/student/course/${courseId}/${lesson.type}/${lesson.id}`
                          );
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "green",
                          }}
                        >
                          {weekIndex % 2 === 0 ? (
                            <>
                              <CheckCircle />
                            </>
                          ) : (
                            <>
                              <RadioButtonUnchecked />
                            </>
                          )}
                        </ListItemIcon>
                        <ListItemText>{lesson.title}</ListItemText>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
                {weekIndex !== tableOfContent.length - 1 && <Divider />}
              </Box>
            </>
          ))}
        </List>
        <Lesson />
      </Box>
    </>
  );
};

export default StudyPage;
