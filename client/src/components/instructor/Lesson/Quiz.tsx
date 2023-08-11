import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import QuizQuestionButton from "./QuizQuestionButton";
import { Add, DeleteOutline, MoreHoriz } from "@mui/icons-material";
import { serverAxios } from "@/utils/axios";
import { useParams } from "react-router-dom";
import useAuth from "@/contexts/useAuth";
import useMenu from "@/hooks/useMenu";
import { toast } from "react-toastify";

export type questionType = {
  title: string;
  options: string[];
  answer: string;
};

const Quiz = () => {
  const { courseId, lessonId } = useParams();
  const { token } = useAuth();
  const [quizQuestions, setQuizQuestions] = useState<questionType[]>([]);
  const [openNewQuiz, setOpenNewQuiz] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState(-1);
  const { register, setValue, watch, handleSubmit, reset } =
    useForm<questionType>({
      defaultValues: {
        title: "",
        options: ["option 1", "option 2", "option 3", "option 4"],
        answer: "",
      },
    });

  const selectedAnswer = watch("answer");
  const onSubmit: SubmitHandler<questionType> = (question) => {
    if (question.answer !== "") {
      if (selectedQuestion === -1) {
        setQuizQuestions((prevState) => {
          const copy = structuredClone(prevState);
          copy.push(question);
          return copy;
        });
      } else {
        setQuizQuestions((prevState) => {
          const copy = structuredClone(prevState);
          copy[selectedQuestion] = question;

          return copy;
        });
      }
      setOpenNewQuiz(false);
      reset();
    }
    setSelectedQuestion(-1);
  };
  const handleSave: React.MouseEventHandler<HTMLButtonElement> = async () => {
    type questionEntryType = {
      title: string;
      options: { content: string[] };
      answer: string;
    };
    type requestBodyType = {
      body: questionEntryType[];
    };
    const requestBody: requestBodyType = {
      body: quizQuestions.map(
        (question): questionEntryType => ({
          title: question.title,
          options: {
            content: question.options,
          },
          answer: question.answer,
        })
      ),
    };
    try {
      await serverAxios.post(`/lesson/quiz/${lessonId}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Quiz saved successfully");
    } catch {
      /* empty */
    }
  };
  const handleEdit = (questionObj: questionType, index: number) => {
    setOpenNewQuiz(true);
    setValue("title", questionObj.title);
    setValue("options", questionObj.options);
    setValue("answer", questionObj.answer);
    setSelectedQuestion(index);
  };
  const handleDelete = (index: number) => {
    setQuizQuestions([...structuredClone(quizQuestions)].splice(index, 1));
    setSelectedQuestion(-1);
  };
  const { handleClick, handleClose, open, menuAnchor } = useMenu();

  useEffect(() => {
    loadData();
    async function loadData() {
      const response = await serverAxios.get(`/lesson/quiz/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizQuestions(
        response.data.questions.map(
          /* eslint-disable-next-line */
          (question: any): questionType => ({
            title: question.title,
            options: question.options.content,
            answer: question.answer,
          })
        )
      );
    }
  }, [courseId, lessonId, token]);
  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          placeContent: "center",
        }}
      >
        {quizQuestions.map((question, index) => (
          <Grid item key={question.title} sx={{}}>
            <ListItem sx={{ height: "100%" }}>
              <Paper
                sx={{
                  m: "10px auto",
                  p: "20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <Tooltip
                    title={
                      <Typography sx={{ fontWeight: "600" }}>
                        {question.title}
                      </Typography>
                    }
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        width: "200px",
                        overflow: "hidden",
                      }}
                    >
                      {question.title}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    onClick={(event) => {
                      setSelectedQuestion(index);
                      handleClick(event);
                    }}
                    sx={{ ml: "30px" }}
                  >
                    <MoreHoriz />
                  </IconButton>
                  <Menu
                    open={open && selectedQuestion === index}
                    onClose={() => handleClose()}
                    anchorEl={menuAnchor}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleEdit(question, index);
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleDelete(index);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </Box>
                <List>
                  {question.options.map((option) => (
                    <ListItem
                      key={option}
                      sx={{
                        outline: "1px solid",
                        outlineColor: (theme) =>
                          `${theme.palette.primary.main}`,
                        width: "140px",
                        justifyContent: "center",
                        margin: "20px 40px",
                        borderRadius: "5px",
                        backgroundColor:
                          option === question.answer
                            ? "primary.main"
                            : "transparent",
                        color:
                          option === question.answer
                            ? "white"
                            : (theme) => `${theme.palette.text.primary}`,
                      }}
                    >
                      {option}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ListItem>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          m: "20px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setOpenNewQuiz(true)}
          sx={{ m: "0 20px" }}
        >
          Add Question
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
      <Dialog open={openNewQuiz}>
        <DialogTitle
          sx={{
            fontSize: "1.4rem",
            fontWeight: "600",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          New Question
        </DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        >
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              {...register("title")}
              sx={{
                "& label": {
                  color: "gray",
                },
              }}
            />
            <FormControl sx={{ m: "20px 0" }} fullWidth>
              <FormLabel
                sx={{
                  color: "primary.main",
                  fontSize: "1.3rem",
                  fontWeight: "600",
                }}
              >
                Choices
              </FormLabel>
              <List
                sx={{
                  padding: "10px 40px",
                }}
              >
                {watch("options").map((option, index) => (
                  <Box key={option} sx={{ position: "relative" }}>
                    <QuizQuestionButton
                      content={option}
                      setContent={(newText: string) => {
                        const newOptions = [...watch("options")];
                        newOptions[index] = newText;
                        setValue("options", newOptions);
                      }}
                      selectValue={selectedAnswer}
                      setValue={setValue}
                    ></QuizQuestionButton>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        transform: "translatey(-50%)",
                        right: "-40px",
                        color: "red",
                      }}
                      onClick={() => {
                        setValue(
                          "options",
                          [...watch("options")].filter(
                            (elem) => elem !== option
                          )
                        );
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))}
                <ListItemButton
                  sx={{
                    m: "10px 0",
                  }}
                  color="primary"
                  onClick={() => {
                    const newOptions = watch("options");
                    newOptions.push(`option ${newOptions.length + 1}`);
                    setValue("options", newOptions);
                  }}
                >
                  <Add /> New Option
                </ListItemButton>
              </List>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                m: "auto",
                gap: "40px",
              }}
            >
              <Button type="submit" variant="contained" sx={{ m: "20px auto" }}>
                Save
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                sx={{ m: "20px auto" }}
                onClick={() => {
                  setOpenNewQuiz(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Quiz;
