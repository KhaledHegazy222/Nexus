import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import Skeleton from "./Skeleton";
import { StyledCard, StyledGridItem, StyledTitle } from "./MyCourses.styled";
import useCourses from "@/contexts/useCourses";
import { Add } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const MyCourses = () => {
  const skeletonItems = Array(10).fill(null);
  const { loading, courses } = useCourses();
  const navigate = useNavigate();
  return (
    <>
      <StyledTitle variant="h3">My Courses</StyledTitle>
      <Grid container>
        {loading ? (
          skeletonItems.map((_, index) => (
            <StyledGridItem item xs={3} key={index}>
              <Skeleton />
            </StyledGridItem>
          ))
        ) : (
          <>
            <StyledGridItem item xs={3}>
              <StyledCard>
                <Button
                  variant="text"
                  sx={{ width: "100%", height: "100%" }}
                  onClick={() => navigate("/instructor/course/new")}
                >
                  <Add
                    sx={{
                      fontSize: "4rem",
                    }}
                  />
                </Button>
              </StyledCard>
            </StyledGridItem>
            {courses.map((course) => (
              <StyledGridItem item xs={3} key={course.id}>
                <Link
                  to={`/instructor/course/${course.id}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <StyledCard sx={{}}>
                    <CardMedia
                      sx={{
                        height: "150px",
                      }}
                      image={course.image}
                      title={course.title}
                    />
                    <CardContent>
                      <Typography variant="h5">{course.title}</Typography>
                      <Typography variant="subtitle2">
                        {course.description}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </Link>
              </StyledGridItem>
            ))}
          </>
        )}
      </Grid>

      <Box
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
        }}
      >
        <Tooltip
          title={<Typography sx={{ fontSize: "1rem" }}>New course</Typography>}
          placement="top"
          arrow
        >
          <Fab
            variant="circular"
            color="primary"
            onClick={() => navigate("/instructor/course/new")}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
};

export default MyCourses;
