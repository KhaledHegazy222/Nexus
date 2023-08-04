type User = {
  id: number;
  first_name: string;
  last_name: string;
  mail: string;
  role: "student" | "admin";
  bio?: string;
  contacts?: string[];
};

type Lesson = {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  completed?: boolean;
  is_public?: boolean;
};

type Week = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Course = {
  id: number;
  title: string;
  image?: string;
  description?: string;
  weeks?: Week[];
  price?: number;
  rating?: number;
  progress?: number;
  instructor?: string;
};

type Quiz = {
  title: string;
  options: string[];
  answer?: string;
  is_correct?: boolean;
};
