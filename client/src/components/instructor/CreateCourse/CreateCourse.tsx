import { Box, Button } from "@mui/material";
import { StyledTitle } from "./CreateCourse.styled";

import Requirements, { RequirementsType } from "./Requirements";
import GeneralInfo, { GeneralInfoType } from "./GeneralInfo";
import { SubmitHandler, useForm } from "react-hook-form";
import { serverAxios } from "@/utils/axios";
import useAuth from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

export type FormValuesType = GeneralInfoType &
  RequirementsType & {
    what_you_will_learn: {
      body: string[];
    };
  };

const CreateCourse = () => {
  const { register, handleSubmit, setValue } = useForm<FormValuesType>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValuesType> = async (data) => {
    data.what_you_will_learn = {
      body: [],
    };
    await serverAxios.post(`/course/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate("/instructor/course/1");
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
