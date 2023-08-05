import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import courseImage from "@/assets/images/course.jpg";
import { StyledLayoutPage } from "@/components/Layout.styled";
import Filter from "@/components/Filter";
import CourseCard from "@/components/CourseCard";
import { useEffect, useState } from "react";
import { serverAxios } from "@/utils/axios";
import Navbar from "@/components/Navbar";

function Explore() {
  const [exploreCourses, setExploreCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    setFilteredCourses(
      exploreCourses.filter((course) =>
        course.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, exploreCourses]);
  useEffect(() => {
    fetchData();
    async function fetchData() {
      const response = await serverAxios.get(`/course`);

      setExploreCourses(
        response.data.map(
          (elem: {
            id: number;
            title: string;
            price: string;
            first_name: string;
            last_name: string;
          }): Course => ({
            id: elem.id,
            title: elem.title,
            image: courseImage,
            rating: 3.5,
            price: Number(elem.price),
            instructor: `${elem.first_name} ${elem.last_name}`,
          })
        )
      );
    }
  }, []);
  return (
    <>
      <StyledLayoutPage>
        <Navbar />
        <Paper sx={{ m: "80px auto", p: "50px 0", width: "70%" }} elevation={4}>
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
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            <Filter />
          </Box>
          <Grid
            container
            sx={{
              placeContent: "center",
            }}
          >
            {filteredCourses.map((course) => (
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
                  instructorName={course.instructor}
                  price={course.price}
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
