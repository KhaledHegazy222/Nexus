import { UseFormRegister } from "react-hook-form";
import { StyledTextField } from "./CreateCourse.styled";
import { FormValuesType } from "./CreateCourse";
import { SxProps, Theme } from "@mui/material";

type TextFieldProps = {
  name: "title" | "description" | "price";
  label: string;
  register: UseFormRegister<FormValuesType>;
  type: string;
  multiline?: boolean;
  maxRows?: number;
  rows?: number;
  helperText?: string;
  step?: number;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
};

const TextField = ({ name, label, register, ...props }: TextFieldProps) => {
  return <StyledTextField label={label} {...register(name)} {...props} />;
};

export default TextField;
