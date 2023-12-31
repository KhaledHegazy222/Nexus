import { Box } from "@mui/material";
import {
  StyledAppBar,
  StyledLink,
  StyledListButton,
  StyledLoginButton,
  StyledLogoImage,
  StyledNavList,
  StyledSignUpButton,
  StyledToolbar,
} from "./Navbar.styled";
import { navLinkType, navLinks } from "./navLinks";
import LogoText from "@/assets/images/Brand/LogoText.svg";
import { useNavigate } from "react-router-dom";
import useAuth from "@/contexts/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
            <StyledLogoImage src={LogoText} alt="Logo" />
          </Box>
        </StyledLink>

        <StyledNavList>
          {navLinks.map((navLink: navLinkType) => (
            <StyledListButton disableRipple key={navLink.text}>
              {navLink.text}
            </StyledListButton>
          ))}
        </StyledNavList>
        {user === null ? (
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
        ) : (
          <Box>
            <StyledSignUpButton
              variant="contained"
              onClick={() =>
                navigate(user.role === "admin" ? "/instructor" : "/student")
              }
            >
              Go to Dashboard
            </StyledSignUpButton>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
