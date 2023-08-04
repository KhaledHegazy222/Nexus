import useCollapseList from "@/hooks/useCollapseList";
import {
  AutoStoriesOutlined,
  ExpandLess,
  ExpandMore,
  OndemandVideo,
  QuizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Link, useParams } from "react-router-dom";
type Props = {
  content: Week[];
};
const TableOfContent: FC<Props> = ({ content }) => {
  const { listState, toggleCollapse } = useCollapseList(content.length, false);
  const { courseId } = useParams();
  return (
    <List>
      {content.map((week, index) => (
        <Box
          key={week.id}
          sx={{
            outline: "1px solid",
            outlineColor: "primary.dark",
            m: "1px",
          }}
        >
          <ListItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "primary.light",
            }}
          >
            <Typography>{`Week: ${week.title}`}</Typography>
            <IconButton onClick={() => toggleCollapse(index)}>
              {listState[index] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItem>
          <Collapse in={listState[index]}>
            <List
              sx={{
                p: "5px",
              }}
            >
              {week.lessons.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  sx={{
                    gap: "10px",
                    justifyContent: "flex-start",
                    outline: "1px solid #ddd",
                    m: "6px 0",
                    borderRadius: "10px",
                    transition: "all ease-in-out 200ms",
                    "&:hover": {
                      ...(lesson.is_public && {
                        outline: "2px solid",
                        outlineColor: (theme) =>
                          `${theme.palette.primary.main}`,
                      }),
                    },
                  }}
                >
                  {lesson.type === "video" ? (
                    <OndemandVideo />
                  ) : lesson.type === "reading" ? (
                    <AutoStoriesOutlined />
                  ) : (
                    <QuizOutlined />
                  )}
                  <Typography sx={{ m: "10px", textTransform: "capitalize" }}>
                    {lesson.is_public ? (
                      <Link
                        to={`/student/course/${courseId}/${lesson.type}/${lesson.id}`}
                      >
                        {lesson.title}
                      </Link>
                    ) : (
                      lesson.title
                    )}
                  </Typography>
                  {lesson.is_public && (
                    <Typography variant="subtitle2" color={"gray"}>
                      (Free)
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      ))}
    </List>
  );
};

export default TableOfContent;
