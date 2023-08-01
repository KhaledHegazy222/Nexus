import { serverAxios } from "@/utils/axios";
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useAuth from "./useAuth";

export type courseType = {
  content: {
    id: string;
    title: string;
    content: Lesson[];
  }[];
};

type contextType = {
  courseData: courseType;
  isLoading: boolean;
  refresh: () => Promise<void>;
};
const defaultValue: contextType = {
  courseData: { content: [] },
  isLoading: true,
  refresh: async () => {},
};

const CourseContext = createContext<contextType>(defaultValue);
type ProviderProps = {
  courseId: string;
  children: ReactNode;
};
const CourseProviderProvider: FC<ProviderProps> = ({ courseId, children }) => {
  const { token } = useAuth();
  const [courseData, setCourseData] = useState<courseType>(
    defaultValue.courseData
  );
  const [isLoading, setIsLoading] = useState<boolean>(defaultValue.isLoading);
  const fetchData = useCallback(async () => {
    const response = await serverAxios.get(`/course/${courseId}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCourseData(response.data);
  }, [token, courseId]);
  useEffect(() => {
    init();
    async function init() {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    }
  }, [fetchData]);
  const value = useMemo(
    () => ({
      courseData: courseData,
      isLoading,
      refresh: fetchData,
    }),
    [courseData, isLoading, fetchData]
  );
  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};
export const useCourse = () => useContext(CourseContext);
export default CourseProviderProvider;
