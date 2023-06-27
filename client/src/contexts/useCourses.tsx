import { useEffect, useState } from "react";
import courseImage from "@/assets/images/course.jpg";
export type courseType = {
  title: string;
  description: string;
  image: string;
};

const coursesSample: courseType[] = [
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
];

const useCourses = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<courseType[]>([]);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCourses(coursesSample);
      setLoading(false);
    }, 1000);
  }, []);

  return { loading, courses };
};

export default useCourses;
