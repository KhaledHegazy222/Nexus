import { Box, Button, ButtonGroup } from "@mui/material";
import { StyledTitle } from "./CreateCourse.styled";

import { RequirementsType, WhatYouWillLearnType } from "./ListMultiInput";
import GeneralInfo, { GeneralInfoType } from "./GeneralInfo";
import { SubmitHandler, useForm } from "react-hook-form";
import { serverAxios } from "@/utils/axios";
import useAuth from "@/contexts/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ListMultiInput from "./ListMultiInput";
import { AxiosError } from "axios";

export type FormValuesType = GeneralInfoType &
  RequirementsType &
  WhatYouWillLearnType;

const CreateCourse = ({ courseData }: { courseData?: FormValuesType }) => {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm<FormValuesType>({
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
    try {
      /* eslint-disable-next-line */
      const requestBody: any = data;
      requestBody.what_you_will_learn = {
        body: data.what_you_will_learn,
      };
      requestBody.requirements = {
        body: data.requirements,
      };
      requestBody.discount = 0;
      requestBody.discount_last_date = "2023-04-15T10:39:37.000Z";
      if (id) {
        await serverAxios.put(`/course/${id}`, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate(`/instructor/course/${id}`);
      } else {
        const response = await serverAxios.post(`/course`, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate(`/instructor/course/${response.data.id}`);
      }
    } catch (error) {
      console.log((error as AxiosError).response?.data);
    }
  };
  const handleCancel = () => navigate(-1);
  const [dataReady, setDataReady] = useState(false);
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
      setDataReady(true);
    } else {
      setDataReady(true);
    }
  }, [courseData, setValue]);
  return (
    <>
      {dataReady && (
        <Box
          sx={{
            width: "70%",
          }}
        >
          <StyledTitle>New Course</StyledTitle>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
          >
            <GeneralInfo courseData={courseData} register={register} />
            <ListMultiInput
              title="Requirements"
              name="requirements"
              defaultValue={courseData?.requirements || []}
              setValue={setValue}
              // watch={watch}
            />
            <ListMultiInput
              title="What You will learn"
              name="what_you_will_learn"
              defaultValue={courseData?.what_you_will_learn || []}
              setValue={setValue}
              // watch={watch}
            />
            <ButtonGroup
              sx={{
                m: "60px auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  fontSize: "1.3rem",
                  textTransform: "none",
                  fontWeight: "600",
                }}
              >
                Save Course
              </Button>
              <Button
                variant="contained"
                color="error"
                type="button"
                onClick={handleCancel}
                sx={{
                  fontSize: "1.3rem",
                  textTransform: "none",
                  fontWeight: "600",
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </Box>
      )}
    </>
  );
};

export default CreateCourse;
