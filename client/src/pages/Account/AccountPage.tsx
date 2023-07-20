import Navbar from "@/components/Navbar";
import {
  StyledAccountBody,
  StyledFormBody,
  StyledFormContainer,
  StyledFormTitle,
  StyledSubmitButton,
  StyledTextField,
} from "./Account.styled";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { Divider } from "@mui/material";
import GoogleLogin from "./Google";
import { useEffect } from "react";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { useNavigate } from "react-router-dom";

type loginFormDataType = {
  email: string;
  password: string;
};

type signUpFormDataType = loginFormDataType & {
  firstName: string;
  lastName: string;
  password: string;
};

type AccountPageProps = {
  login?: boolean;
};

const AccountPage = ({ login = false }: AccountPageProps) => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const signUpOnSubmit: SubmitHandler<signUpFormDataType> = async (data) => {
    type requestType = {
      first_name: string;
      last_name: string;
      mail: string;
      password: string;
    };

    const requestBody: requestType = {
      first_name: data.firstName,
      last_name: data.lastName,
      mail: data.email,
      password: data.password,
    };
    await serverAxios.post("/signup", requestBody);
    navigate("/");
  };

  const loginOnSubmit: SubmitHandler<loginFormDataType> = async (data) => {
    type requestType = {
      mail: string;
      password: string;
    };

    const requestBody: requestType = {
      mail: data.email,
      password: data.password,
    };
    const response = await serverAxios.post("/login", requestBody);
    setToken(response.data.token);
    navigate("/");
  };

  useEffect(() => reset(), [login, reset]);
  return (
    <>
      <Navbar />
      <StyledAccountBody>
        {login ? (
          <StyledFormContainer onSubmit={handleSubmit(loginOnSubmit)}>
            <StyledFormTitle>Login</StyledFormTitle>
            <GoogleLogin />
            <Divider variant="middle" sx={{ margin: "10px 0", color: "gray" }}>
              OR
            </Divider>
            <StyledFormBody>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="Email"
                    type="email"
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="Password"
                    type="password"
                    required
                    {...field}
                  />
                )}
              />
              <StyledSubmitButton variant="contained" type="submit">
                Login
              </StyledSubmitButton>
            </StyledFormBody>
          </StyledFormContainer>
        ) : (
          <StyledFormContainer onSubmit={handleSubmit(signUpOnSubmit)}>
            <StyledFormTitle>Sign Up</StyledFormTitle>
            <GoogleLogin />
            <Divider variant="middle" sx={{ margin: "10px 0", color: "gray" }}>
              OR
            </Divider>
            <StyledFormBody>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="First Name"
                    type="text"
                    required
                    {...field}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="Last Name"
                    type="text"
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="Email"
                    type="email"
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="Password"
                    type="password"
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label="Confirm Password"
                    type="password"
                    required
                    {...field}
                  />
                )}
              />
              <StyledSubmitButton variant="contained" type="submit">
                Sign Up
              </StyledSubmitButton>
            </StyledFormBody>
          </StyledFormContainer>
        )}
      </StyledAccountBody>
    </>
  );
};

export default AccountPage;
