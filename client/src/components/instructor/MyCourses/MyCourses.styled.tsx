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
  aspectRatio: "1 /1",
}));

export const StyledCard = styled(Card)(() => ({
  width: "100%",
  height: "300px",
}));
