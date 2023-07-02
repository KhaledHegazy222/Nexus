import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import { FormValuesType } from "./CreateCourse";

type SelectProps = {
  name: "level" | "field";
  register: UseFormRegister<FormValuesType>;
  title: string;
  options: string[];
};

const SelectField = ({
  name,
  register,
  title,
  options,
  ...props
}: SelectProps) => {
  return (
    <Box
      sx={{
        width: "300px",
        m: "10px",
      }}
    >
      <FormControl fullWidth required>
        <InputLabel
          id="label-id"
          sx={{
            color: "gray",
          }}
        >
          {title}
        </InputLabel>
        <Select label={title} labelId="label-id" {...register(name)} {...props}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectField;
