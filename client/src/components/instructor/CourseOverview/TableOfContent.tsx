import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Collapse,
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
  QuizOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";

import useCollapseList from "@/hooks/useCollapseList";
import useMenu from "@/hooks/useMenu";

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
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  const [tableOfContent, setTableOfContent] = useState<WeekValueType[]>(
    TableOfContentInitialValue
  );
  const { open, handleClick, handleClose, menuAnchor } = useMenu();
  const { listState, toggleCollapse } = useCollapseList(tableOfContent.length);
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
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "primary.light",
                  padding: "10px",
                }}
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
                  <IconButton onClick={() => toggleCollapse(index)}>
                    {listState[index] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </ListItem>

              <Collapse in={listState[index]}>
                <List>
                  {week.lessons.map((lesson) => (
                    <ListItem
                      key={lesson.id}
                      sx={{
                        gap: "10px",
                        justifyContent: "space-between",
                      }}
                    >
                      {lesson.type === "Video" ? (
                        <TextSnippetOutlined />
                      ) : lesson.type === "Reading" ? (
                        <AutoStoriesOutlined />
                      ) : (
                        <QuizOutlined />
                      )}
                      <Box
                        sx={{
                          flex: "1",
                        }}
                      >
                        <Link
                          to={`lesson/${lesson.id}`}
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          <Typography
                            sx={{
                              "&:hover": {
                                color: "primary.main",
                              },
                            }}
                          >
                            {lesson.title}
                          </Typography>
                        </Link>
                      </Box>
                      <KeyboardArrowUp />
                      <KeyboardArrowDown />
                      <IconButton onClick={handleClick}>
                        <MoreHoriz />
                      </IconButton>
                      <Menu
                        open={open}
                        anchorEl={menuAnchor}
                        onClose={handleClose}
                        sx={{
                          ".MuiMenu-paper": {
                            boxShadow: "2px 2px 10px -2px rgb(210,210,210)",
                          },
                        }}
                      >
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
      <Dialog open={false}>
        <DialogTitle variant="h5">Add New Losson</DialogTitle>
        <form
          style={{
            width: "400px",
          }}
        >
          <DialogContent>
            <TextField
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
              <Select labelId="lesson-type-id" label="Type">
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
