type Lesson = {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz";
  completed?: boolean;
  isPublic?: boolean;
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
