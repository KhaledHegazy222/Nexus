import { Paper, Typography, styled } from "@mui/material";

export const StyledSection = styled(Paper)(() => ({
  boxShadow: "none",
  padding: "20px",
  margin: "20px auto",
  width: "clamp(500px,90%,900px)",
  border: "1px solid gray",
}));

export const StyledSectionTitle = styled(Typography)(() => ({
  fontWeight: "600",
  fontSize: "1.7rem",
  textAlign: "center",
  marginBottom: "20px",
}));
