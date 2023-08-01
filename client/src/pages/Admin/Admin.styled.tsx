import { Grid, GridProps, styled } from "@mui/material";
export const StyledGridContainer = styled(Grid)<GridProps>({
  placeContent: "center",
});

export const StyledGridCell = styled(Grid)<GridProps>(({ theme }) => ({
  height: "200px",
  aspectRatio: "1 / 1",
  display: "grid",
  placeContent: "center",
  outline: "2px solid",
  outlineColor: `${theme.palette.primary.main}`,
  backgroundColor: `${theme.palette.primary.light}`,
  margin: "20px",
  fontSize: "1.4rem",
  fontWeight: "600",
  borderRadius: "10px",
}));
