import React, { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  AutoStoriesOutlined,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
  OndemandVideo,
  QuizOutlined,
  TextSnippetOutlined,
  Visibility,
} from "@mui/icons-material";

import useCollapseList from "@/hooks/useCollapseList";
import useMenu from "@/hooks/useMenu";
import { SubmitHandler, useForm } from "react-hook-form";

type LessonValueType = {
  id: string;
  title: string;
  type: "Video" | "Reading" | "Quiz";
};
type WeekValueType = {
  title: string;
  lessons: LessonValueType[];
};
const TableOfContentInitialValue: WeekValueType[] = [
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: "1",
        title: "Introduction to python programming",
        type: "Video",
      },
      { id: "2", title: "Python Documentations", type: "Reading" },
      { id: "3", title: "Unit 1 Exercise", type: "Quiz" },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: "4",
        title: "Introduction to python programming",
        type: "Video",
      },
      { id: "5", title: "Python Documentations", type: "Reading" },
      { id: "6", title: "Unit 1 Exercise", type: "Quiz" },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      { id: "7", title: "Introduction to python programming", type: "Video" },
      { id: "8", title: "Python Documentations", type: "Reading" },
      { id: "9", title: "Unit 1 Exercise", type: "Quiz" },
    ],
  },
];

const TableOfContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number>(-1);
  const [selectLessonId, setSelectedLessonId] = useState<string>("");
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<WeekValueType[]>(
    TableOfContentInitialValue
  );
  const { open, handleClick, handleClose, menuAnchor } = useMenu();
  const { listState, toggleCollapse } = useCollapseList(tableOfContent.length);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit } = useForm<LessonValueType>();
  const onSubmit: SubmitHandler<LessonValueType> = useCallback(
    (e) => {
      e.id = uuid();
      setTableOfContent((prevState) => {
        prevState[selectedWeek].lessons.push(e);
        return prevState;
      });
      setOpenLessonDialog(false);
    },
    [selectedWeek]
  );
  const shiftUpDown = (
    weekIndex: number,
    lessonIndex: number,
    direction: "Upward" | "Downward"
  ) => {
    setEditMode(true);
    if (direction === "Upward") {
      if (lessonIndex !== 0) {
        setTableOfContent((prevTable) => {
          const prevTableCopy = structuredClone(prevTable);
          [
            prevTableCopy[weekIndex].lessons[lessonIndex],
            prevTableCopy[weekIndex].lessons[lessonIndex - 1],
          ] = [
            prevTableCopy[weekIndex].lessons[lessonIndex - 1],
            prevTableCopy[weekIndex].lessons[lessonIndex],
          ];
          return prevTableCopy;
        });
      } else if (weekIndex !== 0) {
        setTableOfContent((prevTable) => {
          const prevTableCopy = structuredClone(prevTable);
          const movedLesson = prevTableCopy[weekIndex].lessons.shift()!;
          prevTableCopy[weekIndex - 1].lessons.push(movedLesson);
          return prevTableCopy;
        });
      }
    } else {
      if (lessonIndex !== tableOfContent[weekIndex].lessons.length - 1) {
        setTableOfContent((prevTable) => {
          const prevTableCopy = structuredClone(prevTable);
          [
            prevTableCopy[weekIndex].lessons[lessonIndex],
            prevTableCopy[weekIndex].lessons[lessonIndex + 1],
          ] = [
            prevTableCopy[weekIndex].lessons[lessonIndex + 1],
            prevTableCopy[weekIndex].lessons[lessonIndex],
          ];
          return prevTableCopy;
        });
      } else {
        if (weekIndex === tableOfContent.length - 1) {
          setTableOfContent((prevValue) => {
            const copy = structuredClone(prevValue);
            copy.push({ title: "New Week", lessons: [] });
            return copy;
          });
        }
        setTableOfContent((prevTable) => {
          const prevTableCopy = structuredClone(prevTable);
          const movedLesson = prevTableCopy[weekIndex].lessons.pop()!;
          prevTableCopy[weekIndex + 1].lessons.unshift(movedLesson);
          return prevTableCopy;
        });
      }
    }
  };

  return (
    <Box
      sx={{
        m: "20px 0",
      }}
    >
      <Typography variant="h5" m={"10px 0"}>
        Table Of Content
      </Typography>
      <List>
        {tableOfContent.map((week, weekIndex) => (
          <ListItem
            key={weekIndex}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "primary.light",
                  padding: "10px",
                }}
              >
                <Typography variant="h6">{`Week ${weekIndex + 1}: ${
                  week.title
                }`}</Typography>
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
                  <IconButton onClick={() => toggleCollapse(weekIndex)}>
                    {listState[weekIndex] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={listState[weekIndex]}>
                <List>
                  {week.lessons.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson.id}
                      sx={{
                        gap: "10px",
                        justifyContent: "space-between",
                      }}
                    >
                      {lesson.type === "Video" ? (
                        <OndemandVideo />
                      ) : lesson.type === "Reading" ? (
                        <AutoStoriesOutlined />
                      ) : (
                        <QuizOutlined />
                      )}

                      <Typography
                        sx={{
                          flex: "1",
                        }}
                      >
                        {lesson.title}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          shiftUpDown(weekIndex, lessonIndex, "Downward")
                        }
                      >
                        <KeyboardArrowDown />
                      </IconButton>
                      <IconButton
                        disabled={weekIndex === 0 && lessonIndex === 0}
                        onClick={() =>
                          shiftUpDown(weekIndex, lessonIndex, "Upward")
                        }
                      >
                        <KeyboardArrowUp />
                      </IconButton>
                      <IconButton
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          handleClick(e);
                          setSelectedLessonId(lesson.id);
                        }}
                      >
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        open={open && selectLessonId === lesson.id}
                        anchorEl={menuAnchor}
                        onClose={handleClose}
                      >
                        <MenuItem
                          disabled={editMode}
                          sx={{
                            gap: "10px",
                          }}
                          onClick={() => navigate(`lesson/${lesson.id}`)}
                        >
                          <Visibility /> View Content
                        </MenuItem>
                        <MenuItem
                          sx={{
                            gap: "10px",
                          }}
                        >
                          <Edit /> Edit
                        </MenuItem>
                        <MenuItem
                          sx={{
                            color: "red",
                            gap: "10px",
                          }}
                        >
                          <Delete /> Remove
                        </MenuItem>
                      </Menu>
                    </ListItem>
                  ))}
                  <ListItem>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        margin: "auto",
                      }}
                      onClick={() => {
                        setSelectedWeek(weekIndex);
                        setOpenLessonDialog(true);
                      }}
                    >
                      <Add /> Add Lesson
                    </Button>
                  </ListItem>
                </List>
              </Collapse>
            </Box>
          </ListItem>
        ))}
      </List>
      {editMode && (
        <Box
          sx={{
            m: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button color="primary" variant="contained">
            Save
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </Box>
      )}
      <Dialog
        open={openLessonDialog}
        onClose={() => setOpenLessonDialog(false)}
      >
        <DialogTitle variant="h5">Add New Lesson</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: "400px",
          }}
        >
          <DialogContent>
            <TextField
              {...register("title")}
              required
              fullWidth
              label="Title"
              sx={{
                m: "10px 0",
                "& label": {
                  color: "gray",
                },
              }}
            />

            <FormControl
              required
              fullWidth
              sx={{
                m: "10px 0",
              }}
            >
              <InputLabel id="lesson-type-id" sx={{ color: "gray" }}>
                Type
              </InputLabel>
              <Select
                labelId="lesson-type-id"
                label="Type"
                {...register("type")}
              >
                <MenuItem value="Video">Video</MenuItem>
                <MenuItem value="Reading">Reading</MenuItem>
                <MenuItem value="Quiz">Quiz</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontSize: "1.2rem",
                margin: "auto",
                marginBottom: "20px",
              }}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TableOfContent;