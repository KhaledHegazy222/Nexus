import { TextField, Typography } from "@mui/material";

const Reviews = () => {
  return (
    <>
      <TextField
        fullWidth
        variant="filled"
        label="Leave your review"
        sx={{
          "& label": {
            color: "gray",
          },
        }}
      />
      <Typography>Other users Reviews</Typography>
    </>
  );
};

export default Reviews;
