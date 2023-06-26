import {
  Box,
  BoxProps,
  Paper,
  PaperProps,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";

export const StyledCoursesContainer = styled(Box)<BoxProps>(() => ({
  width: "70%",
  padding: "20px",
  margin: "auto",
  flex: "1",
  height: "100%",
}));

export const StyledPaper = styled(Paper)<PaperProps>(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  overflow: "auto",
  padding: "10px",
}));

export const StyledTitle = styled(Typography)<TypographyProps>(() => ({
  marginTop: "30px",
  marginBottom: "60px",
}));
