import DashboardNavbar from "@/components/DashboardNavbar/Navbar";
import { StyledLayoutPage, StyledPaper } from "@/components/Layout.styled";
import { StyledGridCell, StyledGridContainer } from "./Admin.styled";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import {
  AttachMoney,
  Group,
  MenuBook,
  Reviews,
  School,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { TopCoursesTable } from "./TopCoursesTable";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import withAuth from "@/HOCs/withAuth";

type AdminStatistics = {
  brief: {
    user_count: string;
    course_count: string;
    review_count: string;
    total_income: string;
    enroll_count: string;
  };
  courses: {
    id: number;
    title: string;
    price: string;
    first_name: string;
    last_name: string;
    rate: string;
    purchase_count: string;
  }[];
};

const statisticsColumns: {
  label: string;
  name:
    | "user_count"
    | "course_count"
    | "review_count"
    | "total_income"
    | "enroll_count";
  icon: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
    muiName: string;
  };
}[] = [
  {
    label: "Users",
    name: "user_count",
    icon: Group,
  },
  {
    label: "Courses",
    name: "course_count",
    icon: School,
  },
  {
    label: "Reviews",
    name: "review_count",
    icon: Reviews,
  },
  {
    label: "Total Income",
    name: "total_income",
    icon: AttachMoney,
  },
  {
    label: "Enrolls",
    name: "enroll_count",
    icon: MenuBook,
  },
];
const Admin = () => {
  const { token } = useAuth();
  const [reviewsData, setReviewsData] = useState<AdminStatistics | null>(null);
  useEffect(() => {
    loadData();
    async function loadData() {
      const response = await serverAxios.get("/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewsData(response.data);
    }
  }, [token]);
  return (
    <StyledLayoutPage>
      <DashboardNavbar />
      <StyledPaper sx={{ m: "30px", width: "70%" }}>
        {reviewsData === null ? (
          <CircularProgress />
        ) : (
          <>
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
              {statisticsColumns.map((column) => (
                <StyledGridCell item xs="auto" key={column.name}>
                  <column.icon
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
                    {column.label}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "1.7rem",
                      color: "primary.main",
                    }}
                  >
                    {reviewsData.brief[column.name]}
                  </Typography>
                </StyledGridCell>
              ))}
            </StyledGridContainer>
            <Box
              m={"10px"}
              sx={{
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "600",
                  textAlign: "center",
                  m: "10px",
                }}
              >
                Top Courses
              </Typography>
              <TopCoursesTable
                courses={reviewsData.courses.map((data) => ({
                  id: data.id,
                  title: data.title,
                  instructor: `${data.first_name} ${data.last_name}`,
                  price: Number(data.price),
                  rating: Number(data.rate),
                  enrollment: Number(data.purchase_count),
                }))}
              />
            </Box>
          </>
        )}
      </StyledPaper>
    </StyledLayoutPage>
  );
};

export default withAuth(Admin);
