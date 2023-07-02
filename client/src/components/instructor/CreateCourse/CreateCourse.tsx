import { Box, Button } from "@mui/material";
import { StyledTitle } from "./CreateCourse.styled";

import Requirements, { RequirementsType } from "./Requirements";
import GeneralInfo, { GeneralInfoType } from "./GeneralInfo";
import { SubmitHandler, useForm } from "react-hook-form";

export type FormValuesType = GeneralInfoType & RequirementsType;

const CreateCourse = () => {
  const { register, handleSubmit, setValue } = useForm<FormValuesType>();
  const onSubmit: SubmitHandler<FormValuesType> = (data) => {
    console.log(data);
  };
  return (
    <>
      <Box
        sx={{
          width: "70%",
        }}
      >
        <StyledTitle>New Course</StyledTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GeneralInfo register={register} />
          <Requirements setValue={setValue} />

          <Button
            type="submit"
            variant="contained"
            sx={{
              fontSize: "1.3rem",
              textTransform: "none",
              fontWeight: "600",
              margin: "30px 0",
              marginLeft: "auto",
              display: "block",
            }}
          >
            Create Course
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreateCourse;
