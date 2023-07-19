import { Paper, styled } from "@mui/material";

export const StyledSection = styled(Paper)(() => ({
  boxShadow: "none",
  padding: "20px",
  margin: "20px auto",
  width: "clamp(500px,90%,900px)",
  border: "1px solid gray",
}));
