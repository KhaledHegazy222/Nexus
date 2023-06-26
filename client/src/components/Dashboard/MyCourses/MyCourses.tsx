import { Box, Grid, Paper, Typography } from "@mui/material";
import Skeleton from "./Skeleton";
import {
  StyledCoursesContainer,
  StyledPaper,
  StyledTitle,
} from "./MyCourses.styled";

type courseType = {
  title: string;
  description: string;
};

const MyCourses = () => {
  return (
    <StyledCoursesContainer>
      <StyledPaper>
        <StyledTitle variant="h3">My Courses</StyledTitle>
        <Grid container>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
          <Grid item xs={3}>
            <Skeleton />
          </Grid>
        </Grid>
      </StyledPaper>
    </StyledCoursesContainer>
  );
};

export default MyCourses;
