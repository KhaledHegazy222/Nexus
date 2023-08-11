import { Button, Grid } from "@mui/material";
import Skeleton from "@/components/Skeleton";
import { StyledCard, StyledGridItem, StyledTitle } from "./MyCourses.styled";
import useCourses from "@/hooks/useCourses";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CourseCard from "@/components/CourseCard";

const MyCourses = () => {
  const skeletonItems = Array(10).fill(null);
  const { loading, courses } = useCourses();
  const navigate = useNavigate();
  return (
    <>
      <StyledTitle variant="h3">My Courses</StyledTitle>
      <Grid
        container
        sx={{
          placeContent: "center",
        }}
      >
        {loading ? (
          skeletonItems.map((_, index) => (
            <StyledGridItem
              item
              xs={"auto"}
              key={index}
              style={{
                width: "clamp(340px, 33%,450px)",
              }}
            >
              <Skeleton />
            </StyledGridItem>
          ))
        ) : (
          <>
            <StyledGridItem
              item
              xs={"auto"}
              style={{
                width: "clamp(340px, 33%,450px)",
              }}
            >
              <StyledCard>
                <Button
                  variant="text"
                  sx={{ height: "100%", width: "100%" }}
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
              <StyledGridItem
                item
                xs={"auto"}
                key={course.id}
                style={{
                  width: "clamp(340px, 33%,450px)",
                }}
              >
                <CourseCard
                  link={`/instructor/course/${course.id}`}
                  image={course.image!}
                  title={course.title}
                  description={course.description}
                  price={199.9}
                  rating={3.5}
                />
              </StyledGridItem>
            ))}
          </>
        )}
      </Grid>
    </>
  );
};

export default MyCourses;
