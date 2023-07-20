import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { questionType } from "./Quiz";
import { ListItemButton, TextField } from "@mui/material";

type QuizButtonProps = {
  content: string;
  setContent: (value: string) => void;
  selectValue: string;
  setValue: UseFormSetValue<questionType>;
};

const QuizQuestionButton: React.FC<QuizButtonProps> = ({
  content,
  setContent,
  selectValue,
  setValue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setIsEditing(true);
    setInputText(content);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInputText(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setContent(inputText);
  };
  return (
    <>
      {isEditing ? (
        <TextField
          fullWidth
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          autoFocus
        />
      ) : (
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
          onDoubleClick={handleDoubleClick}
        >
          {content}
        </ListItemButton>
      )}
    </>
  );
};

export default QuizQuestionButton;
