import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "title",
    headerName: "Title",
    width: 150,
  },
  {
    field: "instructor",
    headerName: "Instructor",
    width: 150,
  },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 150,
  },
  {
    field: "rating",
    headerName: "Rating",
    type: "number",
    width: 150,
  },
  {
    field: "enrollment",
    headerName: "Enrollments",
    type: "number",
    width: 110,
  },
];

// const rows = [
//   {
//     id: 1,
//     title: "Snow",
//     instructor: "Jon",
//     price: 35,
//     rating: 4.3,
//     enrollment: 11,
//   },
//   {
//     id: 2,
//     title: "Snow",
//     instructor: "Jon",
//     price: 35,
//     rating: 4.3,
//     enrollment: 11,
//   },
//   {
//     id: 3,
//     title: "Snow",
//     instructor: "Jon",
//     price: 35,
//     rating: 4.3,
//     enrollment: 11,
//   },
//   {
//     id: 4,
//     title: "Snow",
//     instructor: "Jon",
//     price: 35,
//     rating: 4.3,
//     enrollment: 11,
//   },
//   {
//     id: 5,
//     title: "Snow",
//     instructor: "Jon",
//     price: 35,
//     rating: 4.3,
//     enrollment: 11,
//   },
//   {
//     id: 6,
//     title: "Snow",
//     instructor: "Jon",
//     price: 35,
//     rating: 4.3,
//     enrollment: 11,
//   },
// ];

export const TopCoursesTable = ({
  courses,
}: {
  courses: {
    id: number;
    title: string;
    instructor: string;
    price: number;
    rating: number;
    enrollment: number;
  }[];
}) => {
  return (
    <Box
      sx={{ height: 400, width: "fit-content", maxWidth: "100%", m: "auto" }}
    >
      <DataGrid
        rows={courses}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
