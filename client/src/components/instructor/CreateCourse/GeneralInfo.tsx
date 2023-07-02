import React, { FC } from "react";
import { Box, Typography } from "@mui/material";

import { useState } from "react";
import TextField from "./TextField";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { FormValuesType } from "./CreateCourse";
import SelectField from "./SelectField";

export type GeneralInfoType = {
  title: string;
  description: string;
  level: string;
  field: string;
  price: number;
};

type ComponentProps = {
  register: UseFormRegister<FormValuesType>;
};

const GeneralInfo: FC<ComponentProps> = ({ register }) => {
  return (
    <Box
      sx={{
        margin: "20px 0",
      }}
    >
      <Typography variant="h4">Course Info.</Typography>
      <hr />
      <TextField register={register} name="title" label="Title" type="text" />
      <TextField
        register={register}
        name="description"
        label="Description"
        type="text"
        multiline={true}
        maxRows={5}
      />
      <TextField
        register={register}
        name="price"
        label="Price"
        type="number"
        helperText="Enter the price in EGP"
      />
      <SelectField
        register={register}
        name="level"
        title="Level"
        options={["Beginner", "Intermediate", "Advanced"]}
      />
      <SelectField
        register={register}
        name="field"
        title="Field"
        options={["Software", "Hardware", "Mechanical"]}
      />
    </Box>
  );
};

export default GeneralInfo;
