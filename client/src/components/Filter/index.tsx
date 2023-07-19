import useMenu from "@/hooks/useMenu";
import {
  AttachMoney,
  FilterAltOutlined,
  FilterOutlined,
  Groups,
  ImportContacts,
  School,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Menu,
  SvgIconTypeMap,
  Typography,
} from "@mui/material";
import React, { ReactNode, useState } from "react";
import {
  StyledFilterItem,
  StyledGridCell,
  StyledGridContainer,
} from "./Filter.styled";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type FilterEntryType = {
  name: string;
  value: string;
};

type FilterPossibleValuesType = {
  name: string;
  options: string[];
  icon: ReactNode;
};
const availableFilters: FilterPossibleValuesType[] = [
  {
    name: "Level",
    options: ["Beginner", "Intermediate", "Advanced"],
    icon: <School />,
  },
  {
    name: "Department",
    options: ["CSED", "MTI", "CCE", "BME"],
    icon: <Groups />,
  },
  {
    name: "Field",
    options: ["Software", "Hardware", "Mechanical"],
    icon: <ImportContacts />,
  },
  {
    name: "Price",
    options: ["Free", "non-Free"],
    icon: <AttachMoney />,
  },
];

const Filter = () => {
  const { open, handleClick, handleClose, menuAnchor } = useMenu();
  return (
    <Box
      sx={{
        p: "15px",
      }}
    >
      <Button
        variant={open ? "contained" : "outlined"}
        onClick={(e) => handleClick(e)}
        sx={{
          display: "flex",
          marginLeft: "auto",
        }}
      >
        <FilterAltOutlined /> Filter
      </Button>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={menuAnchor}
        sx={{
          transform: "translate(-80px,20px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            m: "5px",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          Add Filter
        </Typography>
        <StyledGridContainer container>
          {availableFilters.map((filter) => (
            <StyledGridCell item key={filter.name} xs={6}>
              <StyledFilterItem variant="outlined">
                <>
                  {filter.icon}
                  <Typography>{filter.name}</Typography>
                </>
              </StyledFilterItem>
            </StyledGridCell>
          ))}
        </StyledGridContainer>
      </Menu>
    </Box>
  );
};

export default Filter;
