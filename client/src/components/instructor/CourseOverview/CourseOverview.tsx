import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GeneralInfoType } from "../CreateCourse/GeneralInfo";
import {
  RequirementsType,
  WhatYouWillLearnType,
} from "../CreateCourse/ListMultiInput";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { ArrowRight, Edit } from "@mui/icons-material";
import CourseImage from "@/assets/images/course.jpg";

import TableOfContent from "./TableOfContent";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { toast } from "react-toastify";
type CourseValueType = GeneralInfoType &
  RequirementsType &
  WhatYouWillLearnType & {
    isPublished: boolean;
  };

const CourseInitialValue: CourseValueType = {
  title: "",
  description: "",
  field: "Software",
  level: "Beginner",
  price: 0,
  requirements: [],
  what_you_will_learn: [],
  isPublished: false,
};

const CourseOverview = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] =
    useState<CourseValueType>(CourseInitialValue);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const handlePublish = async () => {
    try {
      await serverAxios.patch(
        `/course/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourseData((prevData) => ({ ...prevData, isPublished: true }));
      toast.success("Course Published Successfully");
    } catch {
      /* empty */
    }
  };
  useEffect(() => {
    loadData();
    async function loadData() {
      const response = await serverAxios.get(`/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const {
        title,
        level,
        field,
        description,
        requirements,
        price,
        what_you_will_learn,
        publish,
      } = response.data;
      setCourseData({
        title,
        level,
        field,
        description,
        price: Number(price),
        requirements: requirements.body,
        what_you_will_learn: what_you_will_learn.body,
        isPublished: publish,
      });
    }
  }, [id, token]);

  return (
    <>
      <Box
        sx={{
          margin: "30px",
          width: "clamp(300px,100%,1000px)",
        }}
      >
        <Typography variant="h4" textAlign="center">
          {courseData.title}
        </Typography>

        <img
          src={CourseImage}
          style={{
            margin: "30px auto",
            display: "block",
            minWidth: "60%",
            maxWidth: "600px",
          }}
        />
        <Typography variant="h5">Description</Typography>
        <List>
          <ListItem>
            <Typography>{courseData.description}</Typography>
          </ListItem>
        </List>

        <Typography variant="h6">Level</Typography>
        <List>
          <ListItem>
            <Typography>{courseData.level}</Typography>
          </ListItem>
        </List>
        <Typography variant="h6">Field</Typography>
        <List>
          <ListItem>
            <Typography>{courseData.field}</Typography>
          </ListItem>
        </List>

        <Typography variant="h5">Requirements</Typography>
        <List>
          {courseData.requirements.map((requirement) => (
            <ListItem
              key={requirement}
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <ArrowRight />
              <Typography>{requirement}</Typography>
            </ListItem>
          ))}
        </List>
        <Typography variant="h5">What you will learn</Typography>
        <List>
          {courseData.what_you_will_learn.map((learnElem) => (
            <ListItem
              key={learnElem}
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <ArrowRight />
              <Typography>{learnElem}</Typography>
            </ListItem>
          ))}
        </List>
        <TableOfContent />
        <Button
          variant="contained"
          sx={{ m: "auto", display: "block", textTransform: "none" }}
          onClick={() => setShowAcceptDialog(true)}
          disabled={courseData.isPublished}
        >
          {courseData.isPublished ? "Published" : "Publish Course"}
        </Button>
      </Box>
      <Dialog open={showAcceptDialog}>
        <DialogTitle
          sx={{
            fontWeight: "600",
            fontSize: "1.7rem",
          }}
        >
          Publish Course
        </DialogTitle>
        <DialogContent>
          Please note that publishing the course is{" "}
          <Typography
            component="span"
            sx={{ color: "red", fontWeight: "bold" }}
          >
            IRREVERSIBLE
          </Typography>{" "}
          action, also this will allow users to enroll and view the current
          content of this course. Do you want to proceed ?
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowAcceptDialog(false);
              handlePublish();
            }}
          >
            Publish Course
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowAcceptDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Fab
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
        }}
        color="primary"
        onClick={() => {
          navigate(`/instructor/course/edit/${id}`, {
            state: {
              courseData,
            },
          });
        }}
      >
        <Edit />
      </Fab>
    </>
  );
};

export default CourseOverview;
