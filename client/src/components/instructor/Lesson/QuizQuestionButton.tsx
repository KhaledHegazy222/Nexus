import React, { useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { questionType } from "./Quiz";
import { ListItemButton } from "@mui/material";

type QuizButtonProps = {
  content: string;
  selectValue: string;
  register: UseFormRegister<questionType>;
  setValue: UseFormSetValue<questionType>;
};

const QuizQuestionButton: React.FC<QuizButtonProps> = ({
  content,
  selectValue,
  register,
  setValue,
}) => {
  const [buttonContent, setButtonContent] = useState<string>(content);
  return (
    <ListItemButton
      selected={selectValue === content}
      onClick={() => setValue("answer", content)}
      sx={{
        outline: "1px solid",
        outlineColor: (theme) => `${theme.palette.primary.main}`,
        margin: "10px 0",
        borderRadius: "5px",
        justifyContent: "center",
        color: "black",
        "&.Mui-selected, &.Mui-selected:hover": {
          backgroundColor: "primary.main",
          color: "white",
        },
      }}
    >
      {buttonContent}
    </ListItemButton>
  );
};

export default QuizQuestionButton;
