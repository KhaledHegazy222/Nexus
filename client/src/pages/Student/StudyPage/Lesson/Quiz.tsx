import React, { useState } from "react";
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

const quizQuestions = [
  {
    title: "question title1",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
  {
    title: "question title2",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
  {
    title: "question title2",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
  {
    title: "question title3",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
  {
    title: "question title4",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
  {
    title: "question title5",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
  {
    title: "question title6",
    options: {
      content: ["option1", "option2", "option3", "option4"],
    },
  },
];

const Quiz = () => {
  const [completed, setCompleted] = useState(false);
  const toggleCompleted = () => {
    setCompleted(!completed);
  };
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
        <List>
          {quizQuestions.map((question) => (
            <React.Fragment key={question.title}>
              <Typography
                variant="h5"
                sx={{
                  textTransform: "capitalize",
                }}
              >
                {question.title}
              </Typography>
              <FormControl
                sx={{
                  padding: "10px 30px",
                }}
              >
                <RadioGroup>
                  {question.options.content.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: "primary.main",
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
          sx={{
            display: "block",
            margin: "20px auto",
          }}
        >
          Submit
        </Button>
      </Paper>
      <LessonButtons completed={completed} toggleCompleted={toggleCompleted} />
    </>
  );
};

export default Quiz;
