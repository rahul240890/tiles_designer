"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  TextField,
  Tooltip,
  TablePagination,
  Button,
  Stack,
} from "@mui/material";
import { IconEdit, IconTrash, IconSearch, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import BlankCard from "@/app/components/shared/BlankCard";
import { SuitablePlace } from "@/types/suitablePlace";
import { fetchSuitablePlaces, deleteSuitablePlace } from "@/api/suitablePlace";
import { useNotificationStore } from "@/store/notificationStore"; // ✅ Global Notification Store

const SuitablePlacesList = () => {
  const [suitablePlaces, setSuitablePlaces] = useState<SuitablePlace[]>([]);
  const [orderBy, setOrderBy] = useState<keyof SuitablePlace>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const showNotification = useNotificationStore((state) => state.showNotification); // ✅ Notification Hook

  // ✅ Fetch Suitable Places
  useEffect(() => {
    const loadSuitablePlaces = async () => {
      try {
        const data = await fetchSuitablePlaces();
        setSuitablePlaces(data || []);
      } catch (error: any) {
        showNotification(error.message || "Failed to fetch Suitable Places.", "error");
      }
    };
    loadSuitablePlaces();
  }, []);

  // ✅ Sorting Handler
  const handleRequestSort = (property: keyof SuitablePlace) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  // ✅ Pagination Handlers
  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Search Handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // ✅ Filtered Suitable Places
  const filteredPlaces = suitablePlaces.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Delete Suitable Place
  const handleDelete = async (placeId: string) => {
    if (confirm("Are you sure you want to delete this Suitable Place?")) {
      try {
        await deleteSuitablePlace(placeId);
        setSuitablePlaces((prev) => prev.filter((p) => p.id !== placeId));
        showNotification("Suitable Place deleted successfully.", "success");
      } catch (error: any) {
        showNotification(error.message || "Failed to delete Suitable Place.", "error");
      }
    }
  };

  return (
    <PageContainer title="Suitable Places Management" description="List of all Suitable Places">
      {/* ✅ Breadcrumb */}
      <Breadcrumb title="List of Suitable Places" />

      <BlankCard>
        {/* ✅ Search & Add Button */}
        <Stack direction="row" spacing={2} sx={{ p: 2, mb: 2 }} alignItems="center">
          <TextField
            placeholder="Search Suitable Places..."
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <IconSearch size="1.2rem" style={{ marginRight: 8 }} />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<IconPlus />}
            onClick={() => router.push("/admin/attributes/suitable_places/add")}
          >
            Add Suitable Place
          </Button>
        </Stack>

        {/* ✅ Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Name", "Actions"].map((head, index) => (
                  <TableCell key={index} align={index === 1 ? "center" : "left"}>
                    {index === 0 ? (
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={order}
                        onClick={() => handleRequestSort("name")}
                      >
                        {head}
                      </TableSortLabel>
                    ) : (
                      head
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlaces
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((place) => (
                  <TableRow key={place.id} hover>
                    <TableCell>{place.name}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(place.id)}>
                          <IconTrash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredPlaces.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default SuitablePlacesList;
