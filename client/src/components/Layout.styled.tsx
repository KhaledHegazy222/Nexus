import { Box, BoxProps, Paper, PaperProps, styled } from "@mui/material";
import DashboardBackground from "@/assets/images/DashboardBackground.svg";

export const StyledLayoutPage = styled(Box)<BoxProps>(() => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundImage: `url(${DashboardBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "center center",
}));

export const StyledContentContainer = styled(Box)<BoxProps>(() => ({
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
