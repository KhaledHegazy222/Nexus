import { Box, BoxProps, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import HomeBackground from "@/assets/images/HomeBackground.svg";

export const StyledHeroBody = styled(Box)<BoxProps>(() => ({
  backgroundImage: `url(${HomeBackground})`,
  backgroundSize: "cover",
  backgroundPosition: "bottom center",
  height: "100vh",
  padding: "10%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  justifyContent: "center",
}));

export const StyledHeroTitle = styled(Typography)(() => ({
  fontSize: "5rem",
  fontWeight: "600",
  width: "70%",
  margin: "10px",
}));

export const StyledHeroSubtitle = styled(Typography)(() => ({
  fontSize: "1.5rem",
  fontWeight: "500",
  width: "70%",
  margin: "20px",
}));

export const StyledExploreButton = styled(Button)(() => ({
  color: "white",
  fontSize: "1.1rem",
  fontWeight: "600",
  padding: "15px 20px",
  borderRadius: "10px",
  margin: "20px",
}));
