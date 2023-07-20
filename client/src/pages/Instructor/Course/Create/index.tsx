import { default as CreateCourseComponent } from "@/components/instructor/CreateCourse/CreateCourse";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
/* eslint-disable */
const CreateCourse = ({}: { edit?: boolean }) => {
  const location = useLocation();
  const [courseData, setCourseData] = useState();
  useEffect(() => {
    if (location.state.courseData) {
      setCourseData(location.state.courseData);
    }
  }, [location]);
  return courseData ? (
    <CreateCourseComponent courseData={courseData} />
  ) : (
    <CreateCourseComponent />
  );
};

export default CreateCourse;
