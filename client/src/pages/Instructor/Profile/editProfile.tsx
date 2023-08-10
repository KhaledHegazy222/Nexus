import useAuth from "@/contexts/useAuth";
import { serverAxios } from "@/utils/axios";
import { Add, Close, DeleteOutline, Edit, Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type props = {
  defaultValue: {
    bio: string;
    contacts: object;
  };
  showEditProfile: boolean;
  setShowEditProfile: (data: boolean) => void;
  handleEditData: (bio: string, contacts: object) => void;
};

const EditProfile: FC<props> = ({
  defaultValue,
  showEditProfile,
  setShowEditProfile,
  handleEditData,
}) => {
  const { token } = useAuth();
  const [bio, setBio] = useState(defaultValue.bio);
  const [contacts, setContacts] = useState(defaultValue.contacts);
  const [editMode, setEditMode] = useState(false);
  const handleSave = async (bio: string, contacts: object) => {
    handleEditData(bio, contacts);
    try {
      await serverAxios.post(
        `/member/details`,
        {
          bio,
          contacts,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile Updated Successfully");
    } catch {
      toast.error("Something Wrong happened please try again later");
    }
  };
  return (
    <Dialog
      open={showEditProfile}
      sx={{
        "& > .MuiDialog-container > .MuiPaper-root": {
          minWidth: "min(90%,500px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "600",
          fontSize: "1.8rem",
          pt: "50px",
          textAlign: "center",
        }}
      >
        Edit Profile
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h5"
          sx={{ mt: "20px", mb: "10px", fontWeight: "600" }}
        >
          Bio
        </Typography>
        <TextField
          label="Bio"
          defaultValue={defaultValue.bio}
          value={bio}
          multiline
          maxRows={3}
          sx={{
            m: "10px 0",
            width: "100%",
            "& label": {
              color: "gray",
            },
          }}
          onChange={(e) => setBio(e.target.value)}
        />
        <Typography
          variant="h5"
          sx={{ mt: "20px", mb: "10px", fontWeight: "600" }}
        >
          Contacts
        </Typography>
        <EditableTable
          contacts={contacts}
          setContacts={setContacts}
          setEditMode={setEditMode}
        />
      </DialogContent>
      <DialogActions
        sx={{
          pb: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => setShowEditProfile(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSave(bio, contacts);
            setShowEditProfile(false);
          }}
          disabled={editMode}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;

const EditableTable = ({
  contacts,
  setContacts,
  setEditMode,
}: {
  contacts: object;
  setContacts: (contacts: object) => void;
  setEditMode: (data: boolean) => void;
}) => {
  const [selectedEditKey, setSelectedEditKey] = useState<string>("");
  const [currentContacts, setCurrentContacts] = useState<[string, string][]>(
    Object.entries(contacts)
  );
  const getContactObject = (contactsArray: [string, string][]): object => {
    return contactsArray.reduce(
      (total, current) => ({ ...total, [current[0]]: current[1] }),
      {} as object
    );
  };
  const updateContact = (key: string, value: string, index: number) => {
    const updatedContacts = structuredClone(currentContacts);
    updatedContacts[index] = [key, value];
    setCurrentContacts(updatedContacts);
    setContacts(getContactObject(updatedContacts));
  };
  useEffect(() => {
    setEditMode(Boolean(selectedEditKey));
  }, [selectedEditKey, setEditMode]);
  const entryRef = useRef<HTMLInputElement>();
  const contactRef = useRef<HTMLInputElement>();
  return (
    <>
      <Button
        sx={{
          marginLeft: "auto",
          display: "flex",
          flexWrap: "nowrap",
          mb: "10px",
          fontSize: "0.8rem",
          alignItems: "center",
          justifyContent: "center",
        }}
        variant="outlined"
        onClick={() => {
          const updatedContacts = [
            ...currentContacts,
            ["", ""] as [string, string],
          ];
          setCurrentContacts(updatedContacts);
          setContacts(getContactObject(updatedContacts));
          setSelectedEditKey("");
        }}
      >
        <Add />
        <Typography>New Contact</Typography>
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableRow>
            <TableCell
              sx={{
                textAlign: "center",
              }}
            >
              Entry
            </TableCell>
            <TableCell
              sx={{
                textAlign: "center",
              }}
            >
              Contact
            </TableCell>
            <TableCell
              sx={{
                textAlign: "center",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
          {currentContacts.map(([key, value], index) => (
            <TableRow key={key}>
              {key === selectedEditKey ? (
                <>
                  <TableCell>
                    <TextField
                      size="small"
                      defaultValue={key}
                      inputRef={entryRef}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      defaultValue={value}
                      inputRef={contactRef}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        updateContact(
                          entryRef.current?.value as string,
                          contactRef.current?.value as string,
                          index
                        );
                        setSelectedEditKey("");
                      }}
                      color="primary"
                    >
                      <Save />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedEditKey("");
                      }}
                      color="error"
                    >
                      <Close />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>

                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <IconButton
                      onClick={() => setSelectedEditKey(key)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        const updatedContacts = [
                          ...structuredClone(currentContacts),
                        ];
                        updatedContacts.splice(index, 1);
                        setCurrentContacts(updatedContacts);
                        setContacts(getContactObject(updatedContacts));
                      }}
                      color="error"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </>
  );
};
