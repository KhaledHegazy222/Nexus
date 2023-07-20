import { Avatar, Button, Menu, MenuItem, Typography } from "@mui/material";
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

const DashboardNavbar = () => {
  const accountMenu = useMenu();
  const { user, logout } = useAuth();
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
                fontSize: "1.1rem",
              }}
            >{`${user?.first_name} ${user?.last_name}`}</Typography>
            {accountMenu.open ? <ExpandLess /> : <ExpandMore />}
          </StyledUserContainer>
        </Button>
        <Menu
          open={accountMenu.open}
          anchorEl={accountMenu.menuAnchor}
          onClose={accountMenu.handleClose}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>My Courses</MenuItem>
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default DashboardNavbar;
