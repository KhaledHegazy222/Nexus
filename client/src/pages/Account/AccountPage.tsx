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
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Divider } from "@mui/material";
import axios from "axios";
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
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const signUpOnSubmit: SubmitHandler<signUpFormDataType> = (data) =>
    console.log(data);
  const loginOnSubmit: SubmitHandler<loginFormDataType> = (data) =>
    console.log(data);
  return (
    <>
      <Navbar />
      <StyledAccountBody>
        {login ? (
          <StyledFormContainer onSubmit={handleSubmit(loginOnSubmit)}>
            <StyledFormTitle>Login</StyledFormTitle>
            <GoogleLogin
              onSuccess={async (credentialResponse: CredentialResponse) => {
                console.log(credentialResponse.credential);
                axios.post(
                  `${import.meta.env.VITE_API_ROOT_URL}/api/v1/oauth/google`,
                  {},
                  {
                    headers: { Authorization: credentialResponse.credential },
                  }
                );
              }}
              onError={() => {
                console.log("Failed");
              }}
            />
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
            <GoogleLogin
              onSuccess={() => {
                console.log("Done");
              }}
              onError={() => {
                console.log("Failed");
              }}
            />
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
