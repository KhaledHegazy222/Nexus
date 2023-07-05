import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import QuizQuestionButton from "./QuizQuestionButton";

export type questionType = {
  title: string;
  options: string[];
  answer: string;
};

const Quiz = () => {
  const [quizQuestions, setQuizQuestions] = useState<questionType[]>([]);
  const [openNewQuiz, setOpenNewQuiz] = useState<boolean>(false);
  const { register, setValue, watch, handleSubmit } = useForm<questionType>({
    defaultValues: {
      options: ["option 1", "option 2", "option 3", "option 4"],
    },
  });
  const selectedAnswer = watch("answer");
  const onSubmit: SubmitHandler<questionType> = (question) => {
    setQuizQuestions((prevState) => {
      const copy = structuredClone(prevState);
      console.log(question);
      copy.push(question);
      return copy;
    });
    setOpenNewQuiz(false);
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
        }}
      >
        {quizQuestions.map((question) => (
          <ListItem
            key={question.title}
            sx={{
              display: "block",
            }}
          >
            <Box>
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
            </Box>
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
        <Button variant="contained">Save</Button>
      </Box>
      <Dialog open={openNewQuiz} onClose={() => setOpenNewQuiz(false)}>
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <QuizQuestionButton
                  content="option 1"
                  register={register}
                  selectValue={selectedAnswer}
                  setValue={setValue}
                ></QuizQuestionButton>
                <QuizQuestionButton
                  content="option 2"
                  register={register}
                  selectValue={selectedAnswer}
                  setValue={setValue}
                ></QuizQuestionButton>
                <QuizQuestionButton
                  content="option 3"
                  register={register}
                  selectValue={selectedAnswer}
                  setValue={setValue}
                ></QuizQuestionButton>
                <QuizQuestionButton
                  content="option 4"
                  register={register}
                  selectValue={selectedAnswer}
                  setValue={setValue}
                ></QuizQuestionButton>
              </List>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" sx={{ m: "20px auto" }}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Quiz;
