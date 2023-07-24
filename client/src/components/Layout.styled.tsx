import { Box, BoxProps, Paper, PaperProps, styled } from "@mui/material";
import DashboardBackground from "@/assets/images/DashboardBackground.svg";

export const StyledLayoutPage = styled(Box)<BoxProps>(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  height: "100vh",
  backgroundImage: `url(${DashboardBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center center",
}));

export const StyledContentContainer = styled(Box)<BoxProps>(() => ({
  width: "70%",
  padding: "20px",
  flex: "1",
  margin: "20px",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
}));

export const StyledPaper = styled(Paper)<PaperProps>(() => ({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  height: "10px",
  alignItems: "center",
  overflow: "auto",
  padding: "10px",
}));
