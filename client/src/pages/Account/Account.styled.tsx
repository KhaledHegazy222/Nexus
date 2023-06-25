import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
  styled,
} from "@mui/material";

export const StyledAccountBody = styled(Box)(() => ({
  backgroundImage: "linear-gradient(180deg, #eef9f6 37%, #b4e6d9 100%)",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

export const StyledFormTitle = styled(Typography)(() => ({
  textAlign: "center",
  fontWeight: "600",
  fontSize: "2.5rem",
  margin: "20px",
}));

export const StyledFormContainer = styled("form")(({ theme }) => ({
  padding: "20px 50px",
  backgroundColor: "rgba(255,255,255,0.2)",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "20px",
  width: "clamp(350px,80%,500px)",
  margin: "auto",
}));

export const StyledFormBody = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

export const StyledTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    margin: "10px",
    width: "100%",
    "& label": {
      color: `${theme.palette.text.disabled}`,
    },
  })
);
export const StyledSubmitButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: "600",
  margin: "10px 0",
  width: "100%",
}));
