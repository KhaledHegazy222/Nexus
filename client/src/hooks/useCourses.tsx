import { useEffect, useState } from "react";
import courseImage from "@/assets/images/course.jpg";
import { serverAxios } from "@/utils/axios";
import useAuth from "@/contexts/useAuth";
export type courseType = Course;

const useCourses = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<courseType[]>([]);
  useEffect(() => {
    fetchData();
    async function fetchData() {
      setLoading(true);
      const response = await serverAxios.get(`/member/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(
        response.data.courses.map(
          (elem: {
            id: number;
            title: string;
            first_name: string;
            last_name: string;
            completion_percentage?: string;
            image: string | null;
          }): courseType => ({
            id: elem.id,
            description: "Learn Learn Learn",
            image: elem.image
              ? `https://nexus-platform-s3.s3.amazonaws.com/image/${elem.image}?date=${new Date()}`
              : courseImage,
            title: elem.title,
            progress: Number(elem.completion_percentage),
          })
        )
      );
      setLoading(false);
    }
  }, [token]);

  return { loading, courses };
};

export default useCourses;
