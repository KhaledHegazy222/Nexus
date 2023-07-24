import { CheckCircle } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { FC } from "react";

type Props = {
  completed: boolean;
  toggleCompleted: () => void;
};
const LessonButtons: FC<Props> = ({ completed, toggleCompleted }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Button variant="contained" color="secondary">
        Previous Lesson
      </Button>
      <Button
        variant={completed ? "contained" : "outlined"}
        onClick={toggleCompleted}
        sx={{
          textTransform: "none",
        }}
      >
        {completed ? (
          <>
            <CheckCircle
              sx={{
                marginRight: "10px",
                fontSize: "1.4rem",
              }}
            />
            Completed
          </>
        ) : (
          "Mark as Completed"
        )}
      </Button>
      <Button variant="contained" color="primary">
        Next Lesson
      </Button>
    </Box>
  );
};

export default LessonButtons;
