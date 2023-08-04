import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";

type Props = {
  username: string;
  rating: number;
  comment: string;
  editable?: boolean;
};

const ReviewBody: FC<Props> = ({
  username,
  rating,
  comment,
  editable = false,
}) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <Box
      sx={{
        border: "1px solid #bbb",
        p: "15px",
        borderRadius: "10px",
        m: "30px 0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          alignItems: "center",
          m: "10px 0",
        }}
      >
        <Avatar />
        <Typography sx={{ fontSize: "1.5rem", fontWeight: "600", flex: "1" }}>
          {username}
        </Typography>
        <Rating
          readOnly={!editable || !editMode}
          value={rating}
          precision={0.5}
        />
      </Box>
      {editable ? (
        <>
          <TextField
            fullWidth
            variant="filled"
            label="Leave your review"
            disabled={!editMode}
            multiline={true}
            maxRows={5}
            sx={{
              "& label": {
                color: "gray",
              },
            }}
          />
          <ButtonGroup
            sx={{
              m: "10px auto",
              display: "block",
              textAlign: "center",
            }}
          >
            {editMode ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(false)}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </ButtonGroup>
        </>
      ) : (
        <Typography variant="subtitle2" sx={{ p: "0 20px" }}>
          {comment}
        </Typography>
      )}
    </Box>
  );
};

export default ReviewBody;
