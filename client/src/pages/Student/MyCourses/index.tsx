import CourseCard from "@/components/CourseCard";
import Skeleton from "@/components/Skeleton";
import useCourses from "@/hooks/useCourses";
import { Grid, Typography } from "@mui/material";

const MyCourses = () => {
  const skeletonItems = Array(10).fill(null);
  const { loading, courses } = useCourses();
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
            {" "}
            {courses.map((course) => (
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
                  image={course.image}
                  title={course.title}
                  progress={10}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </>
  );
};

export default MyCourses;
