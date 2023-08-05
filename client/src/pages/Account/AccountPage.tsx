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

import { Button, Divider, Typography } from "@mui/material";
import GoogleLogin from "./Google";
import { useEffect, useState } from "react";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type loginFormDataType = {
  email: string;
  password: string;
};

type signUpFormDataType = loginFormDataType & {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

type AccountPageProps = {
  login?: boolean;
};

const AccountPage = ({ login = false }: AccountPageProps) => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [errors, setErrors] = useState<Partial<signUpFormDataType>>({});
  const [verifyMail, setVerifyMail] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validate = (value: any, field: string): boolean => {
    if (!field) return true;
    if (value[field].length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
      return false;
    }
    if (field === "firstName" || field === "lastName") {
      if (value[field].match(/[0-9]/g)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Can't Contain digits in your name",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
        return true;
      }
    } else if (field === "email") {
      if (
        !value[field].match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "Invalid Email Format",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "",
        }));
        return true;
      }
    } else if (field === "password" || field === "confirmPassword") {
      if (value["password"] !== value["confirmPassword"]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Passwords don't Match",
          confirmPassword: "Passwords don't Match",
        }));
        return false;
      } else if (value[field].length < 6) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password should be at least 6 characters long.",
          confirmPassword: "",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "",
          confirmPassword: "",
        }));
        return true;
      }
    }
    return false;
  };
  const signUpOnSubmit: SubmitHandler<signUpFormDataType> = async (data) => {
    const isValid: boolean = Object.entries(data).every((entry) =>
      validate(data, entry[0])
    );
    if (!isValid) return;
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
    try {
      await serverAxios.post("/auth/signup", requestBody);
      await resendActivationCode();
    } catch (error) {
      toast.error("Email already exists");
    } finally {
      setVerifyMail(true);
    }
  };
  const loginOnSubmit: SubmitHandler<loginFormDataType> = async (data) => {
    if (!validate(data, "email")) return;
    type requestType = {
      mail: string;
      password: string;
    };
    const requestBody: requestType = {
      mail: data.email,
      password: data.password,
    };
    try {
      const response = await serverAxios.post("/auth/login", requestBody);
      setToken(response.data.token);
      navigate("/");
    } catch (error) {
      if ((error as AxiosError).response?.status === 400) {
        toast.error(
          ((error as AxiosError).response?.data as { msg: string }).msg,
          {
            position: "top-right",
          }
        );
      } else {
        toast.error("Invalid Email or Password", {
          position: "top-right",
        });
      }
    }
  };
  const resendActivationCode = async () => {
    try {
      await serverAxios.post(`/auth/verify`, {
        mail: watch("email"),
      });
      toast.success("Check your email to activate your account", {
        autoClose: 2000,
        position: "top-right",
      });
    } catch {
      /* empty */
    }
  };
  const resentResetPassword = async () => {
    try {
      await serverAxios.post(`/auth/reset-password`, {
        mail: watch("email"),
      });
      toast.success("Check your email to reset your password", {
        autoClose: 2000,
        position: "top-right",
      });
    } catch {
      /* empty */
    }
  };
  useEffect(() => {
    reset(), setErrors({});
  }, [login, reset]);
  useEffect(() => {
    const subscription = watch((value, { name }) => validate(value, name!));
    return () => subscription.unsubscribe();
  }, [watch]);
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
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email : ""}
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
              <Typography
                variant="subtitle2"
                color="primary"
                onClick={resentResetPassword}
                sx={{
                  alignSelf: "flex-end",
                  textTransform: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forget Password ?
              </Typography>
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
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName ? errors.firstName : ""}
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
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName ? errors.lastName : ""}
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
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email : ""}
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
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password : ""}
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
                    error={Boolean(errors.confirmPassword)}
                    helperText={
                      errors.confirmPassword ? errors.confirmPassword : ""
                    }
                    required
                    {...field}
                  />
                )}
              />{" "}
              {verifyMail && (
                <Typography>
                  To resend your activation code.{" "}
                  <Button
                    onClick={resendActivationCode}
                    variant="text"
                    sx={{
                      textTransform: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Resend
                  </Button>
                </Typography>
              )}
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
