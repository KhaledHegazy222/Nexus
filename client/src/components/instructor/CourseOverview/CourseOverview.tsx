import { LegacyRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GeneralInfoType } from "../CreateCourse/GeneralInfo";
import { v4 as uuid } from "uuid";
import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  RequirementsType,
  WhatYouWillLearnType,
} from "../CreateCourse/ListMultiInput";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { Add, ArrowRight, Discount, Edit } from "@mui/icons-material";
import CourseImage from "@/assets/images/course.jpg";

import TableOfContent from "./TableOfContent";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { AxiosError } from "axios";
type CourseValueType = GeneralInfoType &
  RequirementsType &
  WhatYouWillLearnType & {
    isPublished: boolean;
    image?: string | null;
    discount?: number;
    discount_last_date?: string;
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
  image: null,
};

const CourseOverview = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] =
    useState<CourseValueType>(CourseInitialValue);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const discountPercentageInputRef = useRef<HTMLInputElement | null>(null);
  const [expiryDate, setExpiryDate] = React.useState<Dayjs | null>(null);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);

  const addStudentMailInputRef = useRef<HTMLInputElement | null>(null);
  const addStudentPaymentInputRef = useRef<HTMLInputElement | null>(null);
  const [showAddStudentDialog, setShowAddStudentDialog] =
    useState<boolean>(false);
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
      toast.error("Can't Publish Course with no content");
    }
  };
  const inputImageRef = useRef<HTMLInputElement>();
  const [, setDummyBoolean] = useState(true);
  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      const requestBody = new FormData();
      requestBody.append("image", event.target.files![0]);
      await serverAxios.post(
        `/course/${id}/image/${courseData.image ?? uuid()}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDummyBoolean((prev) => !prev);
      toast.success("Image Updated Successfully");
    } catch {
      toast.error("Something went wrong,please try again later");
    }
  };
  useEffect(() => {
    loadData();
    async function loadData() {
      setLoading(true);
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
        pic_id,
        discount,
        discount_last_date,
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
        image: pic_id,
        discount: Number(discount),
        discount_last_date: discount_last_date,
      });
      setExpiryDate(dayjs(new Date(discount_last_date)));
      setLoading(false);
    }
  }, [id, token]);

  return loading ? (
    <>
      <CircularProgress />
    </>
  ) : (
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
        <input
          type="file"
          accept="image/*"
          ref={inputImageRef as LegacyRef<HTMLInputElement>}
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <img
          src={
            courseData.image
              ? `https://nexus-platform-s3.s3.amazonaws.com/image/${
                  courseData.image
                }?date=${new Date()}`
              : CourseImage
          }
          style={{
            margin: "30px auto",
            display: "block",
            minWidth: "60%",
            maxWidth: "600px",
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ display: "block", m: "auto" }}
          onClick={() => {
            inputImageRef.current?.click();
          }}
        >
          Change Course Image
        </Button>
        <Typography variant="h5">Price</Typography>
        <List>
          <ListItem>
            {courseData.discount ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    {(
                      ((100 - courseData.discount) / 100) *
                      courseData.price
                    ).toFixed(2)}{" "}
                    EGP
                  </Typography>
                  <Typography
                    sx={{
                      color: "gray",
                      fontSize: "0.9rem",
                      textDecoration: "line-through",
                    }}
                  >
                    {courseData.price} EGP
                  </Typography>
                  <Typography sx={{ color: "red", fontWeight: "600" }}>
                    (Available for{" "}
                    {new Date(
                      courseData.discount_last_date!
                    ).toLocaleDateString("en-GB")}
                    )
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: "600",
                  fontSize: "1.3rem",
                }}
              >
                {courseData.price} EGP
              </Typography>
            )}
          </ListItem>
        </List>
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
          </Typography>
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
      <Dialog open={showDiscountDialog}>
        <DialogTitle sx={{ textAlign: "center" }}>Add Discount</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            label="Percentage"
            type="number"
            sx={{
              m: "10px 0",
              "& label": {
                color: "gray",
              },
            }}
            required
            inputProps={{ min: 0, max: 100 }}
            defaultValue={courseData.discount}
            inputRef={discountPercentageInputRef}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiry Date"
              sx={{
                "& label": {
                  color: "gray",
                },
              }}
              value={expiryDate}
              onChange={(value) => setExpiryDate(value)}
              defaultValue={dayjs("2022-04-17")}
              // defaultValue={dayjs(new Date(courseData.discount_last_date))}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <ButtonGroup
            sx={{
              m: "auto",
              mb: "15px",
            }}
          >
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await serverAxios.put(
                    `/course/${id}`,
                    {
                      ...courseData,
                      discount: discountPercentageInputRef.current?.value,
                      discount_last_date: expiryDate?.toISOString(),
                      what_you_will_learn: {
                        body: courseData.what_you_will_learn,
                      },
                      requirements: { body: courseData.requirements },
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  setShowDiscountDialog(false);
                  toast.success("Discount Added Successfully");
                } catch (error) {
                  console.log((error as AxiosError).response?.data);
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setShowDiscountDialog(false);
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
      <Dialog open={showAddStudentDialog}>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          <TextField
            type="email"
            label="Student mail"
            fullWidth
            sx={{
              m: "10px 0",
              "& label": {
                color: "gray",
              },
            }}
            inputRef={addStudentMailInputRef}
          />
          <TextField
            type="number"
            label="Payment in EGP"
            fullWidth
            sx={{
              m: "10px 0",
              "& label": {
                color: "gray",
              },
            }}
            inputRef={addStudentPaymentInputRef}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup sx={{ m: "auto", mb: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  await serverAxios.post(
                    `/course/${id}`,
                    {
                      mail: addStudentMailInputRef.current?.value,
                      paid: Number(addStudentPaymentInputRef.current?.value),
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success("Enrolled Student Successfully");
                } catch {
                  toast.error("Something went wrong, please try again later");
                } finally {
                  setShowAddStudentDialog(false);
                }
              }}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowAddStudentDialog(false)}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          position: "fixed",
          right: "5%",
          bottom: "5%",
          display: "flex",
          gap: "20px",
        }}
      >
        <Fab color="primary" onClick={() => setShowDiscountDialog(true)}>
          <Discount />
        </Fab>
        <Fab
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
        <Fab color="primary" onClick={() => setShowAddStudentDialog(true)}>
          <Add />
        </Fab>
      </Box>
    </>
  );
};

export default CourseOverview;
