import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import courseImage from "@/assets/images/course.jpg";
import { StyledLayoutPage } from "@/components/Layout.styled";
import Filter from "@/components/Filter";
import CourseCard from "@/components/CourseCard";

const courses = [
  {
    id: 1,
    title: "Fundamentals of Backend Engineering",
    rating: 3.5,
    instructorName: "Omar El-Sayed",
    price: 199.99,
  },
  {
    id: 2,
    title: "Fundamentals of Backend Engineering",
    rating: 3.5,
    instructorName: "Omar El-Sayed",
    price: 199.99,
  },
  {
    id: 3,
    title: "Fundamentals of Backend Engineering",
    rating: 3.5,
    instructorName: "Omar El-Sayed",
    price: 199.99,
  },
  {
    id: 4,
    title: "Fundamentals of Backend Engineering",
    rating: 3.5,
    instructorName: "Omar El-Sayed",
    price: 199.99,
  },
  {
    id: 5,
    title: "Fundamentals of Backend Engineering",
    rating: 3.5,
    instructorName: "Omar El-Sayed",
    price: 199.99,
  },
];

function Explore() {
  return (
    <>
      <StyledLayoutPage>
        <Paper sx={{ m: "20px auto", p: "50px 0", width: "70%" }} elevation={4}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >
            New Courses
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              m: "10px 30px",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              label="Search"
              sx={{
                "& label": {
                  color: "gray",
                  fontSize: "0.9rem",
                },
              }}
            />

            <Filter />
          </Box>
          <Grid
            container
            sx={{
              placeContent: "center",
            }}
          >
            {courses.map((course) => (
              <Grid
                item
                key={course.id}
                xs={3}
                sx={{
                  minWidth: "300px",
                  m: "20px",
                }}
              >
                <CourseCard
                  title={course.title}
                  image={courseImage}
                  link={`/course/${course.id}`}
                  rating={3.5}
                  instructorName="Omar El-Sayed"
                  price={199.99}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </StyledLayoutPage>
    </>
  );
}

export default Explore;
