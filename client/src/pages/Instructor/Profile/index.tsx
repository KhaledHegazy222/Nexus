/* eslint-disable */
import CourseCard from "@/components/CourseCard";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import {
  Avatar,
  Box,
  CircularProgress,
  Fab,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import courseImage from "@/assets/images/course.jpg";
import { Edit } from "@mui/icons-material";
import EditProfile from "./editProfile";
import gmailIcon from "@/assets/svg/gmail.svg";
import linkedIcon from "@/assets/svg/linked-in.svg";
import facebookIcon from "@/assets/svg/facebook.svg";
import whatsappIcon from "@/assets/svg/whatsapp.svg";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";



const iconsLookUpTable: { [key: string]: string } = {
  gmail: gmailIcon,
  linkedin: linkedIcon,
  facebook: facebookIcon,
  whatsapp: whatsappIcon,
};

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [lastCourses, setLastCourses] = useState<
    {
      id: number;
      first_name: string;
      last_name: string;
      price: string;
      title: string;
      image: string | null;
    }[]
  >([]);
  const handleEditData = (bio: string, contacts: object) => {
    setUser({ ...user!, contacts, bio });
  };
  const [, setDummyBoolean] = useState(false);

  const handleUploadImage: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      const imageId: string = user?.image ?? uuid();
      const requestBody = new FormData();
      requestBody.append("image", event.target.files![0]);
      await serverAxios.post(`/member/details/image/${imageId}`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Updated Image Successfully");
      await fetchProfileData();
      setDummyBoolean((prev) => !prev);
    } catch {
      toast.error("Something Wrong happened,please try again later");
    }
  };
  const inputRef = useRef<HTMLInputElement>();
  async function fetchProfileData() {
    const response = await serverAxios.get(`/member/details/${userId}`);
    const {
      id,
      mail,
      role,
      first_name,
      last_name,
      bio,
      contacts,
      courses,
      image,
    } = response.data;
    setUser({
      id,
      first_name,
      last_name,
      mail,
      role,
      bio,
      contacts,
      image,
    });
    setLastCourses(courses);
  }
  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  return (
    <>
      <Box
        sx={{
          p: "20px",
          width: "100%",
        }}
      >
        <input
          accept="image/*"
          type="file"
          style={{ display: "none" }}
          ref={inputRef as LegacyRef<HTMLInputElement> | undefined}
          onChange={handleUploadImage}
        />
        <Tooltip
          title={
            <Typography sx={{ fontSize: "1.2rem" }}>
              change profile image
            </Typography>
          }
        >
          <IconButton
            sx={{ m: "auto", display: "block" }}
            onClick={() => {
              inputRef.current?.click();
            }}
            disabled={currentUser?.id !== Number(userId)}
          >
            <Avatar
              sx={{
                width: "150px",
                height: "150px",
                m: "auto",
              }}
              src={`https://nexus-platform-s3.s3.amazonaws.com/image/${
                user?.image
              }?time=${new Date()}`}
            />
          </IconButton>
        </Tooltip>
        {user === null ? (
          <>
            <CircularProgress />
          </>
        ) : (
          <>
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                textTransform: "capitalize",
                m: "10px",
              }}
            >{`${user?.first_name} ${user?.last_name}`}</Typography>
            <Box sx={{ minHeight: "100px" }}>
              <Typography variant="h5">Biography</Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "gray",
                  fontSize: "1.2rem",
                  p: "10px 30px",
                }}
              >
                {user.bio}
              </Typography>
            </Box>
            <Box sx={{ minHeight: "200px", m: "30px 0" }}>
              <Typography variant="h5">Contacts</Typography>
              <Box>
                {user.contacts && (
                  <List>
                    {Object.entries(user.contacts).map(([key, value]) => (
                      <ListItem key={key}>
                        <Box sx={{ width: "100px", textAlign: "center" }}>
                          {iconsLookUpTable[key.toLocaleLowerCase()] ? (
                            <img
                              src={iconsLookUpTable[key.toLocaleLowerCase()]}
                              style={{
                                width: "40px",
                                aspectRatio: "1 / 1",
                              }}
                            />
                          ) : (
                            <>
                              <Typography>{key}</Typography>
                            </>
                          )}
                        </Box>
                        <Typography
                          sx={{ fontWeight: "600", fontSize: "1.1rem" }}
                        >
                          {value}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Box>
            <Box sx={{ minHeight: "200px", m: "30px 0" }}>
              <Typography variant="h5">
                Courses Made by this instructor
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  overflow: "auto",
                }}
              >
                {lastCourses.map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      width: "clamp(300px,30%,350px)",
                      margin: "20px",
                      flexShrink: "0",
                    }}
                  >
                    <CourseCard
                      image={
                        course.image
                          ? `https://nexus-platform-s3.s3.amazonaws.com/image/${
                              course.image
                            }?date=${new Date()}`
                          : courseImage
                      }
                      link={`/course/${course.id}`}
                      title={course.title}
                      price={Number(course.price)}
                      instructorName={`${course.first_name} ${course.last_name}`}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            {showEditProfile && (
              <EditProfile
                defaultValue={{
                  bio: user.bio ?? "",
                  contacts: user.contacts ?? {},
                }}
                showEditProfile={showEditProfile}
                setShowEditProfile={setShowEditProfile}
                handleEditData={handleEditData}
              />
            )}
          </>
        )}
      </Box>
      {currentUser?.id === user?.id && (
        <Box>
          <Fab
            sx={{ position: "fixed", bottom: "50px", right: "50px" }}
            color="primary"
            size="large"
            onClick={() => setShowEditProfile(true)}
          >
            <Edit />
          </Fab>
        </Box>
      )}
    </>
  );
};

export default Profile;
