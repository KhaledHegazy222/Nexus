import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

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

type LessonValueType = {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
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
        id: "af7c1fe6-d669-414e-b066-e9733f0de7a8",
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: "bca65efd-d928-40c3-afa1-1ff4f2a714f8",
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: "7b62adde-bac6-4103-8169-5b319dc49941",
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: "8b6ffabb-e9bb-4479-b3d1-96ca08ff3075",
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: "7c51f90c-2b47-4368-98e0-b8a242136ca0",
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: "5cbf529f-07a0-4f1c-b696-5410565ab716",
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
  {
    title: "Introduction to Python Programming",
    lessons: [
      {
        id: "81a6be9b-2587-4165-8734-4ea06d4a2616",
        title: "Introduction to python programming",
        type: "video",
      },
      {
        id: "eef21a9c-373e-49a2-a06a-80414abca145",
        title: "Python Documentations",
        type: "reading",
      },
      {
        id: "8b3a68ef-0651-41a3-81ed-00f3573188ff",
        title: "Unit 1 Exercise",
        type: "quiz",
      },
    ],
  },
];

const TableOfContent = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number>(-1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [selectedWeekToEdit, setSelectedWeekToEdit] = useState(-1);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [tableOfContent, setTableOfContent] = useState<WeekValueType[]>(
    TableOfContentInitialValue
  );
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
        public: boolean;
      };
      type weekEntity = {
        week_title: string;
        week_content: lessonEntity[];
      };
      type requestType = {
        fields: weekEntity[];
      };
      const requestBody: requestType = {
        fields: tableOfContent.map(
          (week): weekEntity => ({
            week_title: week.title,
            week_content: week.lessons.map(
              (lesson): lessonEntity => ({
                id: lesson.id,
                type: lesson.type,
                title: lesson.title,
                public: true,
              })
            ),
          })
        ),
      };
      await serverAxios.patch(`/course/${id}/edit/content`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTableOfContentBackup(tableOfContent);
      setEditMode(false);
    } catch (error) {
      console.log(error);
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          week_title: string;
          week_content: {
            id: string;
            type: string;
            title: string;
            public: boolean;
          }[];
        };
        const tableData: WeekValueType[] = response.data.content.fields.map(
          (weekObject: responseDataType): WeekValueType => ({
            title: weekObject.week_title,
            lessons: weekObject.week_content.map((lessonObject) => ({
              id: lessonObject.id,
              title: lessonObject.title,
              type: lessonObject.type as "video" | "reading" | "quiz",
            })),
          })
        );
        setTableOfContent(tableData);
      } catch {
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
                      onClick={(e) => {
                        setSelectedWeekToEdit(weekIndex);
                        weekMenu.handleClose(e);
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
                <List>
                  {week.lessons.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson.id}
                      sx={{
                        gap: "10px",
                        justifyContent: "space-between",
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
