import { useCourse } from "@/contexts/useCourse";
import useCollapseList from "@/hooks/useCollapseList";
import {
  CheckCircle,
  ExpandLess,
  ExpandMore,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const Sidebar = () => {
  const { courseId, lessonId } = useParams();
  console.log(useParams());
  const { courseData } = useCourse();
  const navigate = useNavigate();
  const { listState, toggleCollapse } = useCollapseList(
    courseData.content.length,
    true
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
    </List>
  );
};

export default Sidebar;
