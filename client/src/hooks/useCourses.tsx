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
      const response = await serverAxios.get(`/course`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(
        response.data.map(
          (elem: {
            id: number;
            title: string;
            first_name: string;
            last_name: string;
            completion_percentage?: string;
          }): courseType => ({
            id: elem.id,
            description: "Learn Learn Learn",
            image: courseImage,
            title: elem.title,
            progress: elem.completion_percentage,
          })
        )
      );
      setLoading(false);
    }
  }, [token]);

  return { loading, courses };
};

export default useCourses;
