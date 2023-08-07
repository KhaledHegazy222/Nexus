import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";

import TextField from "./TextField";
import { UseFormRegister } from "react-hook-form";
import { FormValuesType } from "./CreateCourse";
import SelectField from "./SelectField";
import { StyledGridCell } from "./CreateCourse.styled";

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
      <Grid container sx={{ m: "0 auto", p: "0" }}>
        <StyledGridCell item xs={6}>
          <TextField
            register={register}
            name="title"
            label="Title"
            type="text"
            sx={{
              maxWidth: "300px",
            }}
          />
        </StyledGridCell>
        <StyledGridCell item xs={6} sx={{}}>
          <TextField
            register={register}
            name="price"
            label="Price in EGP"
            type="number"
            step={0.01}
            fullWidth
            sx={{
              maxWidth: "300px",
              marginLeft: "auto",
              display: "block",
            }}
          />
        </StyledGridCell>
        <StyledGridCell item xs={12}>
          <TextField
            register={register}
            name="description"
            label="Description"
            type="text"
            multiline={true}
            rows={4}
            sx={{
              width: "100%",
            }}
          />
        </StyledGridCell>
        <StyledGridCell item xs={6}>
          <SelectField
            register={register}
            name="level"
            title="Level"
            options={["Beginner", "Intermediate", "Advanced"]}
            sx={{
              maxWidth: "300px",
            }}
          />
        </StyledGridCell>
        <StyledGridCell item xs={6}>
          <SelectField
            register={register}
            name="field"
            title="Field"
            options={["Software", "Hardware", "Mechanical"]}
            sx={{
              maxWidth: "300px",
              marginLeft: "auto",
            }}
          />
        </StyledGridCell>
      </Grid>
    </Box>
  );
};

export default GeneralInfo;
