import CourseCard from "@/components/CourseCard";
import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import {
  Avatar,
  Box,
  CircularProgress,
  Fab,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import courseImage from "@/assets/images/course.jpg";
import { Edit } from "@mui/icons-material";
import EditProfile from "./editProfile";
import gmailIcon from "@/assets/svg/gmail.svg";
import linkedIcon from "@/assets/svg/linked-in.svg";
import facebookIcon from "@/assets/svg/facebook.svg";
import whatsappIcon from "@/assets/svg/whatsapp.svg";

const iconsLookUpTable: { [key: string]: string } = {
  gmail: gmailIcon,
  linkedin: linkedIcon,
  facebook: facebookIcon,
  whatsapp: whatsappIcon,
};

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [lastCourses, setLastCourses] = useState<
    {
      id: number;
      first_name: string;
      last_name: string;
      price: string;
      title: string;
    }[]
  >([]);
  const handleEditData = (bio: string, contacts: object) => {
    setUser({ ...user!, contacts, bio });
  };
  useEffect(() => {
    fetchProfileData();
    async function fetchProfileData() {
      const response = await serverAxios.get(`/member/details/${userId}`);
      const { id, mail, role, first_name, last_name, bio, contacts, courses } =
        response.data;
      console.log(response.data);
      setUser({
        id,
        first_name,
        last_name,
        mail,
        role,
        bio,
        contacts,
      });
      setLastCourses(courses);
    }
  }, [userId]);
  return (
    <>
      <Box
        sx={{
          p: "20px",
          width: "100%",
        }}
      >
        <Avatar
          alt={`${user?.first_name} ${user?.last_name}`}
          sx={{
            width: "100px",
            height: "100px",
            m: "auto",
          }}
        />
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
                {user.bio || "Leader of all generations"}
              </Typography>
            </Box>
            <Box sx={{ minHeight: "200px", m: "30px 0" }}>
              <Typography variant="h5">Contacts</Typography>
              <Box>
                <List>
                  {Object.entries(user.contacts!).map(([key, value]) => (
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
                      image={courseImage}
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
                defaultValue={{ bio: user.bio!, contacts: user.contacts! }}
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
