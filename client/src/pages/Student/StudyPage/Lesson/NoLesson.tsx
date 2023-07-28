import { Box, Typography } from "@mui/material";
import learnImage from "@/assets/images/learn.avif";
const NoLesson = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeContent: "center",
      }}
    >
      <img
        src={learnImage}
        style={{
          width: "400px",
        }}
      />
      <Typography
        variant="h4"
        sx={{
          color: "primary.main",
          textAlign: "center",
        }}
      >
        Start Learning Now!
      </Typography>
    </Box>
  );
};

export default NoLesson;
