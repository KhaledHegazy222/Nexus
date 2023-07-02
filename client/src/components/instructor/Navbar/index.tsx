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

const DashboardNavbar = () => {
  const accountMenu = useMenu();
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
            <Typography>Khaled Hegazy</Typography>
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
          <MenuItem>Logout</MenuItem>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default DashboardNavbar;
