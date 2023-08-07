import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
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
  Visibility,
} from "@mui/icons-material";

import useCollapseList from "@/hooks/useCollapseList";
import useMenu from "@/hooks/useMenu";
import { SubmitHandler, useForm } from "react-hook-form";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export type LessonValueType = {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  is_public: boolean;
};
export type WeekValueType = {
  id: string;
  title: string;
  lessons: LessonValueType[];
};

const TableOfContent = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number>(-1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [selectedWeekToEdit, setSelectedWeekToEdit] = useState(-1);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<WeekValueType[]>([]);
  const [tableOfContentBackup, setTableOfContentBackup] = useState<
    WeekValueType[]
  >([]);
  const { open, handleClick, handleClose, menuAnchor } = useMenu();
  const weekMenu = useMenu();
  const { listState, toggleCollapse } = useCollapseList(tableOfContent.length);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset, setValue } =
    useForm<LessonValueType>();

  const startEditMode = useCallback(() => {
    if (!editMode) {
      setTableOfContentBackup(tableOfContent);
      setEditMode(true);
    }
  }, [editMode, tableOfContent, setTableOfContentBackup, setEditMode]);
  const toggleFree = (weekIndex: number, lessonIndex: number) => {
    startEditMode();
    setTableOfContent((prevState) => {
      const copy = structuredClone(prevState);
      copy[weekIndex].lessons[lessonIndex].is_public =
        !copy[weekIndex].lessons[lessonIndex].is_public;
      return copy;
    });
  };
  const cancelEditModeChanges = () => {
    setTableOfContent(tableOfContentBackup);
    setEditMode(false);
  };
  const handleDeleteWeek = (weekIndex: number): void => {
    setTableOfContent((prevState) => {
      const stateCopy = [...prevState];
      stateCopy.splice(weekIndex, 1);
      return stateCopy;
    });
  };
  const handleDeleteLesson = (weekIndex: number, lessonId: string): void => {
    setTableOfContent((prevState) => {
      const stateCopy = structuredClone(prevState);
      stateCopy[weekIndex].lessons = stateCopy[weekIndex].lessons.filter(
        (lesson) => lesson.id !== lessonId
      );
      return stateCopy;
    });
  };
  const handleChangeWeekTitle = (value: string) => {
    startEditMode();
    setTableOfContent((prevState) => {
      const stateCopy = structuredClone(prevState);
      stateCopy[selectedWeekToEdit].title = value;
      return stateCopy;
    });
    setSelectedWeekToEdit(-1);
  };
  const handleSave = async () => {
    try {
      type lessonEntity = {
        id: string;
        type: "video" | "reading" | "quiz";
        title: string;
        is_public: boolean;
      };
      type weekEntity = {
        id: string;
        title: string;
        content: lessonEntity[];
      };
      type requestType = {
        weeks: weekEntity[];
      };
      const requestBody: requestType = {
        weeks: tableOfContent.map(
          (week): weekEntity => ({
            id: week.id,
            title: week.title,
            content: week.lessons.map(
              (lesson): lessonEntity => ({
                id: lesson.id,
                type: lesson.type,
                title: lesson.title,
                is_public: Boolean(lesson.is_public),
              })
            ),
          })
        ),
      };
      await serverAxios.patch(`/course/${id}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTableOfContentBackup(tableOfContent);
      setEditMode(false);
      toast.success("Content Saved Successfully");
    } catch (error) {
      toast.error("Can't have Weeks with zero lessons.");
    }

    setEditMode(false);
  };
  const onSubmit: SubmitHandler<LessonValueType> = useCallback(
    (e) => {
      startEditMode();
      if (e.id) {
        setTableOfContent((prevState) => {
          const stateCopy = structuredClone(prevState);
          stateCopy[selectedWeek].lessons[
            stateCopy[selectedWeek].lessons.findIndex(
              (elem) => elem.id === e.id
            )
          ] = e;
          return stateCopy;
        });
      } else {
        e.id = uuid();
        setTableOfContent((prevState) => {
          const stateCopy = structuredClone(prevState);
          stateCopy[selectedWeek].lessons.push(e);
          return stateCopy;
        });
      }
      setOpenLessonDialog(false);
      reset();
    },
    [selectedWeek, startEditMode, reset]
  );
  const shiftUpDown = (
    weekIndex: number,
    lessonIndex: number,
    direction: "Upward" | "Downward"
  ) => {
    startEditMode();
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
            copy.push({ id: uuid(), title: "New Week", lessons: [] });
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
  useEffect(() => {
    loadData();

    async function loadData() {
      try {
        const response = await serverAxios.get(`/course/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        type responseDataType = {
          id: string;
          title: string;
          content: {
            id: string;
            type: string;
            title: string;
            is_public: boolean;
          }[];
        };
        const tableData: WeekValueType[] = response.data.content.map(
          (weekObject: responseDataType): WeekValueType => ({
            id: weekObject.id,
            title: weekObject.title,
            lessons: weekObject.content.map((lessonObject) => ({
              id: lessonObject.id,
              title: lessonObject.title,
              type: lessonObject.type as "video" | "reading" | "quiz",
              is_public: lessonObject.is_public,
            })),
          })
        );
        setTableOfContent(tableData);
      } catch (error) {
        console.log((error as AxiosError).message);
        /* empty */
      }
    }
  }, [token, id]);
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
              m: "1px 0",
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
                  backgroundColor: "#9362d022",
                  padding: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "5px",
                  }}
                >
                  <Typography variant="h6">{`Week ${
                    weekIndex + 1
                  }:`}</Typography>
                  {selectedWeekToEdit === weekIndex ? (
                    <TextField
                      title="Week Title"
                      defaultValue={tableOfContent[weekIndex].title}
                      onBlur={(event) => {
                        handleChangeWeekTitle(event.target.value);
                      }}
                    />
                  ) : (
                    <Typography variant="h6">{week.title}</Typography>
                  )}
                </Box>
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
                  <IconButton
                    onClick={(e) => {
                      weekMenu.handleClick(e);
                      setSelectedWeek(weekIndex);
                    }}
                  >
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    open={weekIndex === selectedWeek && weekMenu.open}
                    anchorEl={weekMenu.menuAnchor}
                    onClose={weekMenu.handleClose}
                  >
                    <ListItemButton
                      sx={{
                        gap: "10px",
                      }}
                      onClick={() => {
                        setSelectedWeekToEdit(weekIndex);
                        weekMenu.handleClose();
                      }}
                    >
                      <Edit /> Edit
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        gap: "10px",
                        color: "red",
                      }}
                      onClick={() => {
                        startEditMode();
                        handleDeleteWeek(weekIndex);
                        weekMenu.handleClose();
                      }}
                    >
                      <Delete /> Remove
                    </ListItemButton>
                  </Menu>
                </Box>
              </Box>

              <Collapse in={listState[weekIndex]}>
                <List
                  sx={{
                    p: "5px",
                  }}
                >
                  {week.lessons.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson.id}
                      sx={{
                        gap: "10px",
                        justifyContent: "space-between",
                        outline: "1px solid #ddd",
                        m: "6px 0",
                        borderRadius: "10px",
                        transition: "all ease-in-out 200ms",

                        "&:hover": {
                          outline: "2px solid",
                          outlineColor: (theme) =>
                            `${theme.palette.primary.main}`,
                          backgroundColor: "primary.light",
                          transform: "scale(1.005)",
                        },
                      }}
                    >
                      {lesson.type === "video" ? (
                        <OndemandVideo />
                      ) : lesson.type === "reading" ? (
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
                      <FormControlLabel
                        label="Free"
                        control={
                          <Checkbox
                            checked={
                              tableOfContent[weekIndex].lessons[lessonIndex]
                                .is_public ?? false
                            }
                            onChange={() => toggleFree(weekIndex, lessonIndex)}
                            sx={{
                              color: "primary.main",
                            }}
                          />
                        }
                      />
                      <IconButton
                        sx={{ color: "inherit" }}
                        onClick={() =>
                          shiftUpDown(weekIndex, lessonIndex, "Downward")
                        }
                      >
                        <KeyboardArrowDown />
                      </IconButton>
                      <IconButton
                        sx={{ color: "inherit" }}
                        disabled={weekIndex === 0 && lessonIndex === 0}
                        onClick={() =>
                          shiftUpDown(weekIndex, lessonIndex, "Upward")
                        }
                      >
                        <KeyboardArrowUp />
                      </IconButton>
                      <IconButton
                        sx={{ color: "inherit" }}
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
                        open={open && selectedLessonId === lesson.id}
                        anchorEl={menuAnchor}
                        onClose={handleClose}
                      >
                        <MenuItem
                          disabled={editMode}
                          sx={{
                            gap: "10px",
                          }}
                          onClick={() =>
                            navigate(`${lesson.type}/${lesson.id}`, {
                              state: {
                                type: lesson.type,
                              },
                            })
                          }
                        >
                          <Visibility /> View Content
                        </MenuItem>
                        <MenuItem
                          sx={{
                            gap: "10px",
                          }}
                          onClick={() => {
                            setValue("id", lesson.id);
                            setValue("title", lesson.title);
                            setValue("type", lesson.type);
                            setSelectedWeek(weekIndex);
                            setOpenLessonDialog(true);
                            handleClose();
                          }}
                        >
                          <Edit /> Edit
                        </MenuItem>
                        <MenuItem
                          sx={{
                            color: "red",
                            gap: "10px",
                          }}
                          onClick={() => {
                            startEditMode();
                            handleDeleteLesson(weekIndex, lesson.id);
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
      <Button
        variant="contained"
        sx={{
          width: "100%",
          display: "flex",
          gap: "10px",
        }}
        onClick={() => {
          startEditMode();
          setTableOfContent((prevTable) => [
            ...prevTable,
            {
              id: uuid(),
              title: "New Week",
              lessons: [],
            },
          ]);
        }}
      >
        <Add /> Add Week
      </Button>
      {editMode && (
        <Box
          sx={{
            m: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button color="primary" variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={cancelEditModeChanges}
          >
            Cancel
          </Button>
        </Box>
      )}
      <Dialog
        open={openLessonDialog}
        onClose={() => setOpenLessonDialog(false)}
      >
        <DialogTitle variant="h5">Lesson Data</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: "400px",
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
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
                <MenuItem value="video">video</MenuItem>
                <MenuItem value="reading">reading</MenuItem>
                <MenuItem value="quiz">quiz</MenuItem>
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
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TableOfContent;
