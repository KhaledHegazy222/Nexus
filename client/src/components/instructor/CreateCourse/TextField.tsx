import { UseFormRegister } from "react-hook-form";
import { StyledTextField } from "./CreateCourse.styled";
import { FormValuesType } from "./CreateCourse";

type TextFieldProps = {
  name: "title" | "description" | "price";
  label: string;
  register: UseFormRegister<FormValuesType>;
  type: string;
  multiline?: boolean;
  maxRows?: number;
  helperText?: string;
};

const TextField = ({ name, label, register, ...props }: TextFieldProps) => {
  return <StyledTextField label={label} {...register(name)} {...props} />;
};

export default TextField;
