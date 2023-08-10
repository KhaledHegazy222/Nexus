import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  username: string;
  rating: number;
  comment: string;
  editable?: boolean;
  created_at: string;
};

const ReviewBody: FC<Props> = ({
  username,
  rating,
  comment,
  editable = false,
  created_at,
}) => {
  const { courseId } = useParams();
  const { token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [currentReview, setCurrentReview] = useState<{
    rating: number;
    comment: string;
  }>({ rating: 2.5, comment: "" });
  const [backup, setBackup] = useState<{
    rating: number;
    comment: string;
  }>();

  useEffect(() => {
    setCurrentReview({ rating, comment });
  }, [rating, comment, setCurrentReview]);
  const startEditMode = () => {
    setEditMode(true);
    setBackup(currentReview);
  };
  const handleCancel = () => {
    setCurrentReview(backup!);
    setEditMode(false);
  };
  const handleSave = async () => {
    try {
      await serverAxios.post(
        `/review`,
        {
          course_id: courseId,
          rate: currentReview.rating,
          content: currentReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMode(false);
      toast.success("Review Updated Successfully");
    } catch {
      toast.error(
        "You may need to enroll in the course first to leave a review!"
      );
    }
  };
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
        <Typography variant="subtitle2" color="gray">
          {new Date(created_at).toLocaleDateString("en-GB")}
        </Typography>
        <Rating
          readOnly={!editable || !editMode}
          value={currentReview.rating || 2.5}
          precision={0.5}
          onChange={(_event, newValue) => {
            setCurrentReview((prevState) => ({
              ...prevState,
              rating: newValue!,
            }));
          }}
        />
      </Box>
      {editable ? (
        <>
          <TextField
            fullWidth
            variant="filled"
            label="Leave your review"
            InputProps={{
              readOnly: !editMode,
            }}
            multiline={true}
            maxRows={5}
            sx={{
              "& label": {
                color: "gray",
              },
            }}
            onChange={(event) => {
              setCurrentReview((prevState) => ({
                ...prevState,
                comment: event.target.value,
              }));
            }}
            value={currentReview.comment}
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
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={startEditMode}>
                Edit
              </Button>
            )}
          </ButtonGroup>
        </>
      ) : (
        <Typography variant="subtitle2" sx={{ p: "0 20px" }}>
          {currentReview.comment}
        </Typography>
      )}
    </Box>
  );
};

export default ReviewBody;
