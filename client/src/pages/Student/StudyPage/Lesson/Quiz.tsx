import React, { useEffect, useState } from "react";
import LessonButtons from "./LessonButtons";
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import useAuth from "@/contexts/useAuth";
import { useParams } from "react-router-dom";
import { serverAxios } from "@/utils/axios";
import { useForm } from "react-hook-form";
import { Check, Close } from "@mui/icons-material";

const Quiz = () => {
  const { token } = useAuth();
  const { courseId, lessonId } = useParams();
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [completed, setCompleted] = useState(false);
  const { setValue, handleSubmit } = useForm();
  const [quizResult, setQuizResult] = useState<boolean[]>([]);
  console.log(quizResult);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const requestBody: { answers: string[] } = {
      answers: new Array(questions.length).fill(""),
    };
    const answers: [string, string][] = Object.entries(data);
    answers.forEach((elem) => {
      requestBody.answers[Number(elem[0])] = elem[1];
    });
    const responseResult: boolean[] = [];
    const response = await serverAxios.post(
      `/course/${courseId}/quiz/${lessonId}/submit`,
      requestBody,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    response.data.body.forEach((result: Quiz) => {
      responseResult.push(result.is_correct!);
    });
    setQuizResult(responseResult);
  };
  const toggleCompleted = () => {
    setCompleted(!completed);
  };
  useEffect(() => {
    fetchData();
    async function fetchData() {
      const response = await serverAxios.get(
        `/course/${courseId}/quiz/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(
        response.data.body.map(
          (question: {
            title: string;
            options: { content: string[] };
          }): Quiz => ({
            title: question.title,
            options: question.options.content,
          })
        )
      );
    }
  }, [token, lessonId, courseId]);
  return (
    <>
      <Paper
        sx={{
          margin: "10px",
          marginBottom: "30px",
          padding: "10px",
          height: "480px",
          overflow: "auto",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <List>
            {questions.map((question, index) => (
              <React.Fragment key={question.title}>
                <Typography
                  variant="h5"
                  sx={{
                    textTransform: "capitalize",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    color: quizResult.length
                      ? quizResult[index]
                        ? "green"
                        : "red"
                      : "black",
                  }}
                >
                  {question.title}
                  {Boolean(quizResult.length) &&
                    (quizResult[index] ? <Check /> : <Close />)}
                </Typography>

                <FormControl
                  sx={{
                    padding: "10px 30px",
                  }}
                >
                  <RadioGroup>
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={
                          <Radio
                            sx={{
                              color: "primary.main",
                            }}
                            onChange={() => {
                              setValue(index.toString(), option);
                            }}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </React.Fragment>
            ))}
          </List>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            sx={{
              display: "block",
              margin: "20px auto",
            }}
          >
            Submit
          </Button>
        </form>
      </Paper>
      <LessonButtons completed={completed} toggleCompleted={toggleCompleted} />
    </>
  );
};

export default Quiz;
