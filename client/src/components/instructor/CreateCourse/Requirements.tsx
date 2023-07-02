/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Add, Close } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { StyledTextField } from "./CreateCourse.styled";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormValuesType } from "./CreateCourse";

export type RequirementsType = {
  requirements: string[];
};
type RequirementsProps = {
  setValue: UseFormSetValue<FormValuesType>;
};
const Requirements: React.FC<RequirementsProps> = ({ setValue }) => {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [collectInput, setCollectInput] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleAdd = () => {
    setRequirements((prevRequirements) => [
      ...prevRequirements,
      inputRef.current?.value as string,
    ]);
    inputRef.current!.value = "";
  };
  useEffect(() => {
    setValue("requirements", requirements);
  }, [requirements, setValue]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Requirements</Typography>
        <IconButton color="primary" onClick={() => setCollectInput(true)}>
          <Add />
        </IconButton>
      </Box>
      <hr />
      <Box>
        {requirements.map((requirement: string, index: number) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 10px ",
            }}
          >
            <Typography>{requirement}</Typography>
            <IconButton
              onClick={() =>
                setRequirements((prevRequirements) =>
                  prevRequirements.filter(
                    (prevRequirement, prevIndex) =>
                      prevRequirement !== requirement || prevIndex !== index
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
            label="Requirement"
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
      )}
    </>
  );
};

export default Requirements;
