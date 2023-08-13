import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
  Theme,
} from "@mui/material";
import { UseFormRegister } from "react-hook-form";
import { FormValuesType } from "./CreateCourse";

type SelectProps = {
  name: "level" | "field";
  register: UseFormRegister<FormValuesType>;
  title: string;
  options: string[];
  sx?: SxProps<Theme>;
  defaultValue: string;
};

const SelectField = ({
  name,
  register,
  title,
  options,
  sx,
  defaultValue,
  ...props
}: SelectProps) => {
  return (
    <Box sx={sx}>
      <FormControl fullWidth required>
        <InputLabel
          id="label-id"
          sx={{
            color: "gray",
          }}
        >
          {title}
        </InputLabel>
        <Select
          label={title}
          labelId="label-id"
          {...register(name)}
          {...props}
          defaultValue={defaultValue}
        >
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
