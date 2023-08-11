/* eslint-disable */
import { useEffect, useState } from "react";
import ReviewBody from "./ReviewBody";
import useAuth from "@/contexts/useAuth";
import { toast } from "react-toastify";
import { serverAxios } from "@/utils/axios";
import { useParams } from "react-router-dom";
type Review = {
  id: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
};
const othersReviews: Review[] = [
  {
    id: 1,
    username: "Caroline I.",
    rating: 2.5,
    comment:
      "Dr. Angela's courses are truly the gold standard. This comprehensive course goes above and beyond, covering everything you need to know about Python and more, including web scraping, web development, Git, Database, and much more.",
    created_at: "2023-08-05T21:39:12.926Z",
  },
  {
    id: 2,
    username: "Salih B.",
    rating: 2.5,
    comment:
      "i've followed so many tutorials on the internet trying to learn python but in almost all of them there were not enough exercises for every concept which was explained and you'd learn alot of concepts in one set but without enough exercises to strengthen your understanding. But following this course there was not a single concept explained without enough excersies and not easy ones to be honest :]. Thank you Angela from the heart.",
    created_at: "2023-08-05T21:39:12.926Z",
  },
  {
    id: 3,
    username: "Moses M.",
    rating: 2.5,
    comment:
      "I was zero in Python and started this course. Angela is a really good tutor as well as a guide. You will feel awesome and confident after completing this course.",
    created_at: "2023-08-05T21:39:12.926Z",
  },
  {
    id: 4,
    username: "Praveen K.",
    rating: 2.5,
    comment:
      "If you are looking to go deep in Python this is the course you want to take. You're not sitting through hours of lectures and following along. She teaches and then gives you a challenge from small projects. As you get better you get less help and have to figure out more of the challenge independently. Then the challenges get bigger and bigger as you progress.",
    created_at: "2023-08-05T21:39:12.926Z",
  },
];
const Reviews = () => {
  const { user } = useAuth();

  const { courseId } = useParams();
  const [loadedReviews, setLoadedReviews] = useState<Review[]>(othersReviews);
  const myReview = loadedReviews.find((elem) => elem.id === user?.id);

  useEffect(() => {
    loadData();
    async function loadData() {
      try {
        const response = await serverAxios.get(
          `/review/filters?courseid=${courseId}`
        );
        setLoadedReviews(
          response.data.map(
            ({
              id,
              first_name,
              last_name,
              rate,
              content,
              created_at,
            }: {
              id: number;
              first_name: string;
              last_name: string;
              rate: string;
              content: string;
              created_at: string;
            }): Review => ({
              id: id,
              username: `${first_name} ${last_name}`,
              comment: content,
              created_at,
              rating: Number(rate),
            })
          )
        );
      } catch {
        toast.error("Couldn't load reviews. try again later");
      }
    }
  }, [courseId]);
  return (
    <>
      {user !== null && (
        <ReviewBody
          username={`${user.first_name} ${user.last_name}`}
          rating={myReview?.rating ?? 2.5}
          comment={myReview?.comment ?? "My Review"}
          editable={true}
          created_at={myReview?.created_at ?? "2023-08-05T21:39:12.926Z"}
        />
      )}
      {loadedReviews
        .filter((review) => review.id !== user?.id)
        .map((review) => (
          <ReviewBody
            key={review.id}
            username={review.username}
            rating={review.rating}
            comment={review.comment}
            created_at={review.created_at}
          />
        ))}
    </>
  );
};

export default Reviews;
