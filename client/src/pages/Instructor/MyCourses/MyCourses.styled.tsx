import {
  Card,
  Grid,
  GridProps,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";

export const StyledTitle = styled(Typography)<TypographyProps>(() => ({
  marginTop: "30px",
  marginBottom: "60px",
}));

export const StyledGridItem = styled(Grid)<GridProps>(() => ({
  padding: "10px",
}));

export const StyledCard = styled(Card)(() => ({
  height: "300px",
}));
