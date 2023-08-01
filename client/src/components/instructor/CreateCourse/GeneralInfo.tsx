import { FC } from "react";
import { Box, Typography } from "@mui/material";

import TextField from "./TextField";
import { UseFormRegister } from "react-hook-form";
import { FormValuesType } from "./CreateCourse";
import SelectField from "./SelectField";

export type GeneralInfoType = {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  field: "Software" | "Hardware" | "Mechanical";
  price: number;
};

type GeneralInfoProps = {
  register: UseFormRegister<FormValuesType>;
};

const GeneralInfo: FC<GeneralInfoProps> = ({ register }) => {
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
        step={0.01}
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
