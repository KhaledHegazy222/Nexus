import {
  AppBar,
  AppBarProps,
  Button,
  ButtonProps,
  List,
  ListItemButton,
  ListProps,
  Toolbar,
  ToolbarProps,
  Typography,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";

export const StyledAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
  backgroundColor: "#d0c2e5",
  boxShadow: "none",
  color: `${theme.palette.text.primary}`,
}));

export const StyledToolbar = styled(Toolbar)<ToolbarProps>(() => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.text.primary}`,
}));

// Logo Image
export const StyledLogoImage = styled("img")(() => ({
  width: "200px",
}));

// Logo Typography
export const StyledLogoText = styled(Typography)(() => ({
  fontWeight: "600",
  fontSize: "2rem",
  marginTop: "7px",
}));

// Nav Links List
export const StyledNavList = styled(List)<ListProps>(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
}));
// Nav Link Button
export const StyledListButton = styled(ListItemButton)(({ theme }) => ({
  fontSize: "1.1rem",
  "&:hover": {
    backgroundColor: "transparent",
    color: `${theme.palette.primary.main}`,
  },
}));

// Login Button
export const StyledLoginButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  color: `${theme.palette.text.primary}`,
  fontSize: "1.2rem",
  textTransform: "none",
  fontWeight: "600",
  width: "130px",
  borderRadius: "10px",
  margin: "0 10px",
  "&:hover": {
    borderColor: `${theme.palette.text.primary}`,
  },
}));

// Sign up Button
export const StyledSignUpButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: "white",
  fontSize: "1.2rem",
  textTransform: "none",
  fontWeight: "600",
  minWidth: "130px",
  borderRadius: "10px",
  margin: "0 10px",
}));
