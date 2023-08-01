import { FC, useEffect, useRef, useState } from "react";
import { FormValuesType } from "./CreateCourse";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
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
  watch: UseFormWatch<FormValuesType>;
  setValue: UseFormSetValue<FormValuesType>;
  defaultValue: string[];
};
const ListMultiInput: FC<Props> = ({
  title,
  name,
  setValue,
  watch,
  defaultValue,
}) => {
  const [listValues, setListValues] = useState<string[]>(defaultValue);
  const [collectInput, setCollectInput] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleAdd = () => {
    setListValues((prevList) => [
      ...prevList,
      inputRef.current?.value as string,
    ]);
    inputRef.current!.value = "";
  };
  useEffect(() => {
    setValue(name, listValues);
  }, [listValues, setValue, name]);
  useEffect(() => {
    setListValues(watch(name));
  }, [watch, name]);
  useEffect(() => {
    setListValues(defaultValue);
  }, [defaultValue]);

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
                margin: "0 10px ",
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
                    color: "red",
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
