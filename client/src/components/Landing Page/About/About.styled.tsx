import { Box, styled } from "@mui/material";
import AboutBackground from "@/assets/images/AboutBackground.svg";

export const StyledAboutBody = styled(Box)(() => ({
  backgroundImage: `url(${AboutBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "top center",
  minHeight: "100vh",
}));
