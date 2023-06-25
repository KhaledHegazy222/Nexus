import { Box } from "@mui/material";
import {
  StyledAppBar,
  StyledLink,
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
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <StyledLink to="/#hero">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <StyledLogoImage src={Logo} alt="Logo" />
            <StyledLogoText>exsus</StyledLogoText>
          </Box>
        </StyledLink>

        <StyledNavList>
          {navLinks.map((navLink: navLinkType) => (
            <StyledListButton disableRipple key={navLink.text}>
              {navLink.text}
            </StyledListButton>
          ))}
        </StyledNavList>

        <Box>
          <StyledLoginButton
            variant="outlined"
            onClick={() => navigate("/account/login")}
          >
            Log in
          </StyledLoginButton>
          <StyledSignUpButton
            variant="contained"
            onClick={() => navigate("/account/sign-up")}
          >
            Sign up
          </StyledSignUpButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
