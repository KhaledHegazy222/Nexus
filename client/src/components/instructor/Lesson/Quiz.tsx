import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import QuizQuestionButton from "./QuizQuestionButton";
import { Add } from "@mui/icons-material";
import { serverAxios } from "@/utils/axios";
import { useParams } from "react-router-dom";
import useAuth from "@/contexts/useAuth";

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
      setQuizQuestions((prevState) => {
        const copy = structuredClone(prevState);
        copy.push(question);
        return copy;
      });
      setOpenNewQuiz(false);
      reset();
    }
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
    console.log(quizQuestions);
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
      await serverAxios.post(
        `/course/${courseId}/quiz/${lessonId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch {
      /* empty */
    }
  };
  return (
    <>
      <List
        sx={{
          width: "100%",
        }}
      >
        {quizQuestions.map((question) => (
          <ListItem key={question.title}>
            <Paper
              sx={{
                m: "10px auto",
                p: "20px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "700",
                }}
              >
                {question.title}
              </Typography>
              <List>
                {question.options.map((option) => (
                  <ListItem
                    key={option}
                    sx={{
                      outline: "1px solid",
                      outlineColor: (theme) => `${theme.palette.primary.main}`,
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
        ))}
      </List>
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
                  <QuizQuestionButton
                    key={option}
                    content={option}
                    setContent={(newText: string) => {
                      const newOptions = [...watch("options")];
                      newOptions[index] = newText;
                      setValue("options", newOptions);
                    }}
                    selectValue={selectedAnswer}
                    setValue={setValue}
                  ></QuizQuestionButton>
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
                  <Add /> New Question
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
                Add
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
