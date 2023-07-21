import { Box, Button } from "@mui/material";
import { StyledTitle } from "./CreateCourse.styled";

import Requirements, { RequirementsType } from "./Requirements";
import GeneralInfo, { GeneralInfoType } from "./GeneralInfo";
import { SubmitHandler, useForm } from "react-hook-form";
import { serverAxios } from "@/utils/axios";
import useAuth from "@/contexts/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export type FormValuesType = GeneralInfoType &
  RequirementsType & {
    what_you_will_learn: {
      body: string[];
    };
  };

const CreateCourse = ({ courseData }: { courseData?: FormValuesType }) => {
  const { id } = useParams();
  const { register, handleSubmit, setValue, watch } = useForm<FormValuesType>({
    defaultValues: courseData
      ? { ...courseData }
      : {
          title: undefined,
          description: undefined,
          requirements: undefined,
          field: undefined,
          level: undefined,
          price: undefined,
          what_you_will_learn: undefined,
        },
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValuesType> = async (data) => {
    /* eslint-disable-next-line */
    const requestBody: any = data;
    requestBody.what_you_will_learn = {
      body: [],
    };
    requestBody.requirements = {
      body: data.requirements,
    };
    if (id) {
      await serverAxios.put(`/course/${id}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/instructor/course/${id}`);
    } else {
      const response = await serverAxios.post(`/course/create`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/instructor/course/${response.data.id}`);
    }
  };
  useEffect(() => {
    if (courseData) {
      Object.entries(courseData).forEach((pair) => {
        const [fieldName, value] = pair;
        setValue(
          fieldName as
            | "title"
            | "description"
            | "level"
            | "field"
            | "price"
            | "requirements"
            | "what_you_will_learn",
          value
        );
      });
    }
  }, [courseData, setValue]);
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
          <Requirements setValue={setValue} watch={watch} />

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
            Save Course
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreateCourse;
