import {
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";

export const StyledTitle = styled(Typography)<TypographyProps>(() => ({
  fontSize: "2.5rem",
  fontWeight: "600",
  marginTop: "30px",
  marginBottom: "50px",
  textAlign: "center",
}));

export const StyledTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    margin: "10px",
    display: "block",
    maxWidth: "300px",
    "& label": {
      color: `${theme.palette.text.disabled}`,
    },
  })
);
