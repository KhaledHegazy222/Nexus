import { Box, Skeleton as MuiSkeleton } from "@mui/material";
const Skeleton = () => {
  return (
    <>
      <Box
        sx={{
          padding: "5px",
        }}
      >
        <MuiSkeleton variant="rectangular" height={"150px"} animation="wave" />
        <MuiSkeleton
          variant="rounded"
          animation="wave"
          sx={{
            margin: "5px 0",
          }}
        />
        <MuiSkeleton
          variant="rounded"
          animation="wave"
          width={"50%"}
          sx={{
            margin: "5px 0",
          }}
        />
      </Box>
    </>
  );
};

export default Skeleton;
