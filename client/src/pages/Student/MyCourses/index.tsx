import CourseCard from "@/components/CourseCard";
import Skeleton from "@/components/Skeleton";
import useCourses from "@/hooks/useCourses";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import noCourses from "@/assets/images/nocourses.jpg";

const MyCourses = () => {
  const skeletonItems = Array(10).fill(null);
  const { loading, courses } = useCourses();
  const navigate = useNavigate();
  return (
    <>
      <Typography
        variant="h3"
        sx={{
          marginTop: "30px",
          marginBottom: "60px",
        }}
      >
        My Courses
      </Typography>
      <Grid
        container
        sx={{
          placeContent: "center",
        }}
      >
        {loading ? (
          skeletonItems.map((_, index) => (
            <Grid
              key={index}
              item
              xs={"auto"}
              style={{
                width: "clamp(340px, 33%,450px)",
                padding: "10px",
              }}
            >
              <Skeleton />
            </Grid>
          ))
        ) : (
          <>
            {courses.length ? (
              courses.map((course) => (
                <Grid
                  item
                  xs={"auto"}
                  key={course.id}
                  style={{
                    width: "clamp(340px, 33%,450px)",
                    padding: "10px",
                  }}
                >
                  <CourseCard
                    link={`/student/course/${course.id}`}
                    image={course.image!}
                    title={course.title}
                    progress={course.progress}
                  />
                </Grid>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <img
                  src={noCourses}
                  style={{ maxWidth: "100%", maxHeight: "50vh" }}
                />
                <Typography variant="h6">
                  Looks like you didn&apos;t enroll to any course yet. Start
                  Learning Now
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/explore")}
                >
                  Explore Now
                </Button>
              </Box>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default MyCourses;
