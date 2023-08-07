import { FC, useEffect, useRef, useState } from "react";
import { FormValuesType } from "./CreateCourse";
import { UseFormSetValue } from "react-hook-form";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { StyledTextField } from "./CreateCourse.styled";

export type RequirementsType = {
  requirements: string[];
};
export type WhatYouWillLearnType = {
  what_you_will_learn: string[];
};
type Props = {
  title: string;
  name: "requirements" | "what_you_will_learn";

  setValue: UseFormSetValue<FormValuesType>;
  defaultValue: string[];
};
const ListMultiInput: FC<Props> = ({ title, name, setValue, defaultValue }) => {
  const [listValues, setListValues] = useState<string[]>(defaultValue);
  const [collectInput, setCollectInput] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleAdd = () => {
    if (inputRef.current!.value) {
      setListValues((prevList) => [
        ...prevList,
        inputRef.current?.value as string,
      ]);
      inputRef.current!.value = "";
    }
  };
  useEffect(() => {
    console.log("What");
    setValue(name, listValues);
  }, [listValues, setValue, name]);

  useEffect(() => {
    console.log(defaultValue, name, 11);
    setListValues(defaultValue);
  }, [defaultValue, name]);

  return (
    <>
      <Box
        sx={{
          m: "50px auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">{title}</Typography>
          <IconButton color="primary" onClick={() => setCollectInput(true)}>
            <Add />
          </IconButton>
        </Box>
        <hr />
        <Box>
          {listValues.map((listItem: string, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                outline: "2px solid",
                outlineColor: (theme) => `${theme.palette.primary.main}`,
                borderRadius: "100px",
                padding: "0 10px",
                m: "10px 0",
              }}
            >
              <Typography>{listItem}</Typography>
              <IconButton
                onClick={() =>
                  setListValues((prevList) =>
                    prevList.filter(
                      (prevListItem, prevIndex) =>
                        prevListItem !== listItem || prevIndex !== index
                    )
                  )
                }
              >
                <Close
                  sx={{
                    color: "gray",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </IconButton>
            </Box>
          ))}
          {collectInput && (
            <StyledTextField
              fullWidth
              label={title}
              inputRef={inputRef}
              size="small"
              multiline={true}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAdd();
                }
              }}
              sx={{ m: "10px 0" }}
            />
          )}
        </Box>
        {collectInput && (
          <Box
            sx={{
              margin: "10px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
            <Button variant="contained" onClick={() => setCollectInput(false)}>
              Cancel
            </Button>
          </Box>
        )}{" "}
      </Box>
    </>
  );
};

export default ListMultiInput;
