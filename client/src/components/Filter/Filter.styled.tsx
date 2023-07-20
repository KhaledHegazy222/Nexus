import { Button, ButtonProps, Grid, GridProps, styled } from "@mui/material";

export const StyledFilterItem = styled(Button)<ButtonProps>(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none",
}));

export const StyledGridContainer = styled(Grid)<GridProps>(() => ({
  width: "250px",
  height: "250px",
  margin: "5px 10px",
}));

export const StyledGridCell = styled(Grid)<GridProps>(() => ({
  padding: "4px",
}));
