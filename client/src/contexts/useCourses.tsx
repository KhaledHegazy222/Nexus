import { useEffect, useState } from "react";
import courseImage from "@/assets/images/course.jpg";
export type courseType = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const coursesSample: courseType[] = [
  {
    id: 1,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 2,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 3,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 4,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 5,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 6,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 7,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 8,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 9,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 10,
    title: "Learn Python in 3 minutes",
    description: "Learn Learn Learn Learn Learn Learn Learn Learn Learn",
    image: courseImage,
  },
  {
    id: 11,
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
