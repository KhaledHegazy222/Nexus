import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Avatar, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  console.log(currentUser);
  console.log(userId);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchProfileData();
    async function fetchProfileData() {
      const response = await serverAxios.get(`/details/${userId}`);
      const { id, mail, role, first_name, last_name, bio, contacts } =
        response.data;
      setUser({
        id,
        first_name,
        last_name,
        mail,
        role,
        bio,
        contacts,
      });
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
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            textTransform: "capitalize",
            m: "10px",
          }}
        >{`${user?.first_name} ${user?.last_name}`}</Typography>
        <Typography variant="h4">Biography</Typography>
        <Typography
          variant="h6"
          sx={{
            color: "gray",
            fontSize: "1.2rem",
            p: "10px 30px",
          }}
        >
          {user?.bio || "Leader of all generations"}
        </Typography>
        <Typography variant="h4">Contacts</Typography>

        <Typography variant="h4">Courses Made by this instructor</Typography>
      </Box>
    </>
  );
};

export default Profile;
