/* eslint-disable */
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Rating,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

type CourseProps = {
  link: string;
  image: string;
  title: string;
  description?: string;
  price?: number;
  rating?: number;
  instructorName?: string;
  progress?: number;
  discount?: number;
};

const CourseCard: FC<CourseProps> = ({
  image,
  title,
  description,
  instructorName,
  price,
  rating,
  progress,
  link,
  discount,
}) => {
  return (
    <Link
      to={link}
      style={{
        textDecoration: "none",
      }}
    >
      <Card>
        <CardMedia
          image={image}
          title={title}
          sx={{
            height: "200px",
            width: "100%",
          }}
        />
        <CardContent>
          <Typography component={"h3"} fontWeight="600">
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "gray",
              fontSize: "0.9rem",
            }}
          >
            {description}
          </Typography>
          <Typography
            component={"p"}
            sx={{
              color: "gray",
              fontSize: "0.9rem",
            }}
          >
            {instructorName}
          </Typography>
          {(price !== undefined || rating !== undefined) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {price !== undefined && (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "800",
                    flex: "1",
                  }}
                >
                  {`${discount ? discount * price : price} EGP`}{" "}
                </Typography>
              )}
              {rating !== undefined && (
                <>
                  <Box display="flex" alignItems="center">
                    <Typography
                      sx={{
                        fontWeight: "800",
                        fontSize: "1.1rem",
                        color: "#faaf00",
                      }}
                    >
                      {rating}
                    </Typography>
                    <Rating value={rating} precision={0.1} readOnly />
                  </Box>
                </>
              )}
            </Box>
          )}
          {progress !== undefined && (
            <>
              <Typography
                sx={{
                  margin: "10px auto",
                }}
              >
                Completed:{" "}
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "600",
                    color: "primary.main",
                    fontSize: "1.1rem",
                  }}
                >
                  {progress}
                </Typography>
                %
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: "10px",
                  borderRadius: "10px",
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
