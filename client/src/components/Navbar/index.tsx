import { Box, Button, List, ListItemButton, Typography } from "@mui/material";
import {
  StyledAppBar,
  StyledListButton,
  StyledLoginButton,
  StyledLogoImage,
  StyledLogoText,
  StyledNavList,
  StyledSignUpButton,
  StyledToolbar,
} from "./Navbar.styled";
import { navLinkType, navLinks } from "./navLinks";
import Logo from "@/assets/images/Logo.png";

const Navbar = () => {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <StyledLogoImage src={Logo} alt="Logo" />
          <StyledLogoText>exsus</StyledLogoText>
        </Box>

        <StyledNavList>
          {navLinks.map((navLink: navLinkType) => (
            <StyledListButton disableRipple key={navLink.text}>
              {navLink.text}
            </StyledListButton>
          ))}
        </StyledNavList>

        <Box>
          <StyledLoginButton variant="outlined">Log in</StyledLoginButton>
          <StyledSignUpButton variant="contained">Sign up</StyledSignUpButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
