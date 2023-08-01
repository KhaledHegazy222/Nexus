import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import { StyledLayoutPage, StyledPaper } from "@/components/Layout.styled";
import { StyledGridCell, StyledGridContainer } from "./Admin.styled";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  AttachMoney,
  Group,
  MenuBook,
  Reviews,
  School,
} from "@mui/icons-material";

const Admin = () => {
  return (
    <StyledLayoutPage>
      <DashboardNavbar />
      <StyledPaper sx={{ m: "30px", width: "70%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            position: "relative",
            p: "30px",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: "600",
            }}
          >
            Latest Activity
          </Typography>
          <FormControl
            sx={{
              minWidth: "150px",
              position: "absolute",
              right: "30px",
              "& label": {
                color: "gray",
              },
            }}
          >
            <InputLabel id="filer-label">Filter By</InputLabel>
            <Select
              label="Filter By"
              labelId="filter-label"
              defaultValue="All time"
            >
              <MenuItem value="Last Month">Last Month</MenuItem>
              <MenuItem value="Last 2 Months">Last 2 Months</MenuItem>
              <MenuItem value="Last 3 Months">Last 3 Months</MenuItem>
              <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
              <MenuItem value="Last year">Last year</MenuItem>
              <MenuItem value="All time">All time</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <StyledGridContainer container>
          <StyledGridCell item xs="auto">
            <Group
              sx={{
                margin: "auto",
                fontSize: "2.7rem",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.4rem",
                whiteSpace: "nowrap",
              }}
            >
              Users
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.7rem",
                color: "primary.main",
              }}
            >
              {11}
            </Typography>
          </StyledGridCell>
          <StyledGridCell item xs="auto">
            <School
              sx={{
                margin: "auto",
                fontSize: "2.7rem",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.4rem",
                whiteSpace: "nowrap",
              }}
            >
              Courses
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.7rem",
                color: "primary.main",
              }}
            >
              {11}
            </Typography>
          </StyledGridCell>
          <StyledGridCell item xs="auto">
            <Reviews
              sx={{
                margin: "auto",
                fontSize: "2.7rem",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.4rem",
                whiteSpace: "nowrap",
              }}
            >
              Reviews
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.7rem",
                color: "primary.main",
              }}
            >
              {11}
            </Typography>
          </StyledGridCell>
          <StyledGridCell item xs="auto">
            <AttachMoney
              sx={{
                margin: "auto",
                fontSize: "2.7rem",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.4rem",
                whiteSpace: "nowrap",
              }}
            >
              Total Income
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.7rem",
                color: "primary.main",
              }}
            >
              {11}
            </Typography>
          </StyledGridCell>
          <StyledGridCell item xs="auto">
            <MenuBook
              sx={{
                margin: "auto",
                fontSize: "2.7rem",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.4rem",
                whiteSpace: "nowrap",
              }}
            >
              Enrolls
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "1.7rem",
                color: "primary.main",
              }}
            >
              {11}
            </Typography>
          </StyledGridCell>
        </StyledGridContainer>
      </StyledPaper>
    </StyledLayoutPage>
  );
};

export default Admin;
