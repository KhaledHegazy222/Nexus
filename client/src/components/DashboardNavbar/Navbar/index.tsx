import { Avatar, Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  StyledAppBar,
  StyledLink,
  StyledLogoContainer,
  StyledLogoImage,
  StyledLogoText,
  StyledToolbar,
  StyledUserContainer,
} from "./Navbar.styled";

import Logo from "@/assets/images/Logo.png";

import useMenu from "@/hooks/useMenu";
import useAuth from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const accountMenu = useMenu();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <StyledLink to="/">
          <StyledLogoContainer>
            <StyledLogoImage src={Logo} />
            <StyledLogoText>exus</StyledLogoText>
          </StyledLogoContainer>
        </StyledLink>
        <Button onClick={accountMenu.handleClick}>
          <StyledUserContainer>
            <Avatar />
            <Typography
              sx={{
                textTransform: "capitalize",
                fontWeight: "600",
                fontSize: "1.3rem",
              }}
            >{`${user?.first_name} ${user?.last_name}`}</Typography>
            {accountMenu.open ? <ExpandLess /> : <ExpandMore />}
          </StyledUserContainer>
        </Button>
        <Menu
          open={accountMenu.open}
          anchorEl={accountMenu.menuAnchor}
          onClose={accountMenu.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ width: "250px" }}>
            {user?.role === "admin" && (
              <>
                <MenuItem
                  onClick={() => navigate(`/instructor/profile/${user.id}`)}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={() => navigate(`/admin`)}>Admin</MenuItem>
              </>
            )}
            <MenuItem
              onClick={() =>
                navigate(user?.role === "admin" ? "/instructor" : "/student")
              }
            >
              My Courses
            </MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Box>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default DashboardNavbar;
