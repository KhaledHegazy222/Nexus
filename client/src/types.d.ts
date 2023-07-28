type Lesson = {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  completed?: boolean;
};

type Week = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  image?: string;
  description?: string;
  price?: string;
  rating?: string;
  progress?: string;
  instructor?: string;
};
