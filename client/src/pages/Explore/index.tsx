import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import courseImage from "@/assets/images/course.jpg";
import { StyledLayoutPage } from "@/components/instructor/Layout.styled";
import { Link } from "react-router-dom";
import Filter from "@/components/Filter";

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
                <Link
                  to={`/course/${course.id}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Card
                    sx={{
                      transition: "250ms ease-in-out",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <CardMedia
                      image={courseImage}
                      title={course.title}
                      sx={{
                        height: "200px",
                        width: "100%",
                      }}
                    ></CardMedia>
                    <CardContent>
                      <Typography
                        component={"h3"}
                        sx={{
                          fontWeight: "600",
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        component={"p"}
                        sx={{
                          color: "gray",
                          fontSize: "0.9rem",
                        }}
                      >
                        {course.instructorName}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "800",
                            flex: "1",
                          }}
                        >
                          {`${course.price} EGP`}{" "}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "800",
                            fontSize: "1.1rem",
                            color: "#faaf00",
                          }}
                        >
                          {course.rating}
                        </Typography>
                        <Rating
                          value={course.rating}
                          precision={0.1}
                          readOnly
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </StyledLayoutPage>
    </>
  );
}

export default Explore;
