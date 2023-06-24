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

export const StyledAppBar = styled(AppBar)<AppBarProps>(() => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  color: "black",
}));

export const StyledToolbar = styled(Toolbar)<ToolbarProps>(() => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
}));

// Logo Image
export const StyledLogoImage = styled("img")(() => ({
  width: "40px",
  aspectRatio: "1 / 1",
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
export const StyledLoginButton = styled(Button)<ButtonProps>(() => ({
  color: "black",
  border: "1px solid black",
  fontSize: "1.2rem",
  textTransform: "none",
  fontWeight: "600",
  width: "130px",
  borderRadius: "10px",
  margin: "0 10px",
  "&:hover": {
    borderColor: "black",
  },
}));

// Sign up Button
export const StyledSignUpButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: "white",
  fontSize: "1.2rem",
  textTransform: "none",
  fontWeight: "600",
  width: "130px",
  borderRadius: "10px",
  margin: "0 10px",
}));
