import MyCourses from "@/components/Dashboard/MyCourses/MyCourses";
import DashboardNavbar from "@/components/Dashboard/Navbar";
import { Box } from "@mui/material";
import DashboardBackground from "@/assets/images/DashboardBackground.svg";
const Dashboard = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundImage: `url(${DashboardBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <DashboardNavbar />
        <MyCourses />
      </Box>
    </>
  );
};

export default Dashboard;
