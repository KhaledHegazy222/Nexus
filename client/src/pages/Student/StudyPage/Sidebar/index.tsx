/* eslint-disable */
import { useCourse } from "@/contexts/useCourse";
import useCollapseList from "@/hooks/useCollapseList";
import { courseType } from "@/contexts/useCourse";
import {
  CheckCircle,
  ExpandLess,
  ExpandMore,
  RadioButtonUnchecked,
  School,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Sidebar = () => {
  const { courseId, lessonId } = useParams();
  const { courseData } = useCourse();
  const navigate = useNavigate();
  const { listState, toggleCollapse } = useCollapseList(
    courseData.content.length,
    true
  );
  const [showGetCertificate, setShowGetCertificate] = useState<boolean>(false);
  const serializeCourse = useCallback((courseData: courseType): Lesson[] => {
    const serializeLessons = courseData.content?.reduce(
      (serializedData, currentWeek) => {
        return [...serializedData, ...currentWeek.content];
      },
      [] as Lesson[]
    ) as Lesson[];
    return serializeLessons;
  }, []);

  const total = useMemo(
    () => serializeCourse(courseData).length,
    [serializeCourse, courseData]
  );
  const completed = useMemo(
    () =>
      serializeCourse(courseData).filter((lesson) => lesson.completed).length,
    [serializeCourse, courseData]
  );

  return (
    <List
      sx={{
        borderRight: "1px solid gray",
        padding: "5px",
        height: "500px",
        overflowY: "auto",
        overflowX: "visible",
        width: "600px",
      }}
    >
      {courseData.content.map((week, weekIndex) => (
        <Box mb={"10px"} key={week.title}>
          <ListItemButton
            onClick={() => toggleCollapse(weekIndex)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <ListItemText
              sx={{
                whiteSpace: "nowrap",
                marginRight: "10px",
                "& span": {
                  fontWeight: "600",
                  fontSize: "1.1rem",
                },
              }}
            >
              {week.title}
            </ListItemText>
            <ListItemIcon
              sx={{
                minWidth: "unset",
              }}
            >
              {listState[weekIndex] ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          </ListItemButton>
          <Collapse in={listState[weekIndex]}>
            <Divider />
            <List>
              {week.content.map((lesson) => {
                if (lesson.id === lessonId)
                  if (!listState[weekIndex]) toggleCollapse(weekIndex);
                return (
                  <ListItemButton
                    key={lesson.id}
                    onClick={() => {
                      navigate(
                        `/student/course/${courseId}/${lesson.type}/${lesson.id}`
                      );
                    }}
                    sx={{
                      bgcolor: lesson.id === lessonId ? "#ddd" : "#fff",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "green",
                      }}
                    >
                      {lesson.completed ? (
                        <>
                          <CheckCircle />
                        </>
                      ) : (
                        <>
                          <RadioButtonUnchecked />
                        </>
                      )}
                    </ListItemIcon>
                    <ListItemText>{lesson.title}</ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
          {weekIndex !== courseData.content.length - 1 && <Divider />}
        </Box>
      ))}
      <Dialog open={showGetCertificate}>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "600", fontSize: "1.7rem" }}
        >
          Receive Certificate
        </DialogTitle>
        {total === completed ? (
          <>
            <DialogContent>
              <Typography
                component={"span"}
                sx={{ color: "primary.main", fontWeight: "600" }}
              >
                Congratulations
              </Typography>{" "}
              on completing the course. you can get your certificate right now!
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setShowGetCertificate(false);
                }}
              >
                Get Certificate
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              Complete all the lessons first to get your certificate
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setShowGetCertificate(false);
                }}
              >
                Continue Learning
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Box>
        <Fab
          color="primary"
          variant="extended"
          sx={{ position: "fixed", right: "5%", bottom: "5%" }}
          onClick={() => setShowGetCertificate(true)}
        >
          <School sx={{ mr: "15px" }} />
          <Typography sx={{ textTransform: "none" }}>
            Get Certificate
          </Typography>
        </Fab>
      </Box>
    </List>
  );
};

export default Sidebar;
