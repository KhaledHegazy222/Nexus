import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import { StyledLayoutPage, StyledPaper } from "@/components/Layout.styled";
import { Box } from "@mui/material";

const Admin = () => {
  return (
    <StyledLayoutPage>
      <DashboardNavbar />
      <StyledPaper sx={{ m: "30px", width: "70%" }}>
        <Box>Admin Page</Box>
      </StyledPaper>
    </StyledLayoutPage>
  );
};

export default Admin;
