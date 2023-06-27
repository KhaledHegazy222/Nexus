import {
  Box,
  BoxProps,
  Card,
  Grid,
  GridProps,
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
  height: "50%",
}));

export const StyledPaper = styled(Paper)<PaperProps>(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  overflow: "scroll",
  padding: "10px",
}));

export const StyledTitle = styled(Typography)<TypographyProps>(() => ({
  marginTop: "30px",
  marginBottom: "60px",
}));

export const StyledGridItem = styled(Grid)<GridProps>(() => ({
  padding: "10px",
  aspectRatio: "1 /1",
}));

export const StyledCard = styled(Card)(() => ({
  width: "100%",
  height: "300px",
}));
