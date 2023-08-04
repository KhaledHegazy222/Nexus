import {
  AppBar,
  AppBarProps,
  Box,
  BoxProps,
  Toolbar,
  ToolbarProps,
  Typography,
  TypographyProps,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";

export const StyledAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
  padding: "10px",
  backgroundColor: `#d0c2e5`,
  color: `${theme.palette.text.primary}`,
  boxShadow: "none",
}));
export const StyledToolbar = styled(Toolbar)<ToolbarProps>(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.text.primary}`,
}));
export const StyledLogoContainer = styled(Box)<BoxProps>(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
}));
export const StyledLogoImage = styled("img")(() => ({
  width: "200px",
}));
export const StyledLogoText = styled(Typography)<TypographyProps>(() => ({
  fontWeight: "600",
  fontSize: "2rem",
  marginTop: "7px",
}));

export const StyledUserContainer = styled(Box)<BoxProps>(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));
