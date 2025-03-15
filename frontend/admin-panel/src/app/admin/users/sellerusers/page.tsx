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
  Chip,
  Snackbar,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import { IconEdit, IconTrash, IconSearch, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import BlankCard from "@/app/components/shared/BlankCard";
import { deleteSellerUser, fetchSellerUsers } from "../../api/sellerUserAPI";
import { SellerUser } from "../../types/sellerUser";

const SellerUserList = () => {
  const [sellerUsers, setSellerUsers] = useState<SellerUser[]>([]);
  const [orderBy, setOrderBy] = useState<keyof SellerUser>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch Seller Users
  useEffect(() => {
    const loadSellerUsers = async () => {
      try {
        const data = await fetchSellerUsers();
        setSellerUsers(data);
      } catch (error) {
        setError("Failed to fetch seller users. Please try again.");
      }
    };
    loadSellerUsers();
  }, []);

  // Sorting handler
  const handleRequestSort = (property: keyof SellerUser) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // Filtered Seller Users
  const filteredSellerUsers = sellerUsers.filter(
    (sellerUser) =>
      sellerUser.username.toLowerCase().includes(search.toLowerCase()) ||
      sellerUser.email.toLowerCase().includes(search.toLowerCase())
  );

  // Action handlers
  const handleDelete = async (sellerUserId: number) => {
    if (confirm("Are you sure you want to delete this seller user?")) {
      try {
        await deleteSellerUser(sellerUserId);
        setSellerUsers((prev) => prev.filter((s) => s.id !== sellerUserId));
        setSuccess("Seller user deleted successfully.");
      } catch (error) {
        setError("Failed to delete seller user. Please try again.");
      }
    }
  };

  // Close alerts
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <PageContainer title="Seller User Management" description="List of all seller users">
      {/* Breadcrumb */}
      <Breadcrumb title="List of Seller Users" />

      {/* Alerts for errors and success messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert variant="filled" severity="error" onClose={handleCloseAlert}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert variant="filled" severity="success" onClose={handleCloseAlert}>
          {success}
        </Alert>
      </Snackbar>

      <BlankCard>
        {/* Search & Add Button in Same Row */}
        <Stack direction="row" spacing={2} sx={{ p: 2, mb: 2 }} alignItems="center">
          <TextField
            placeholder="Search Seller User..."
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
            onClick={() => router.push("/admin/users/sellerusers/add")}
          >
            Add Seller User
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Username", "Email", "Role", "Seller ID", "Actions"].map((head, index) => (
                  <TableCell key={index} align={index === 4 ? "center" : "left"}>
                    {index < 4 ? (
                      <TableSortLabel
                        active={orderBy === head.toLowerCase().replace(" ", "_")}
                        direction={orderBy === head.toLowerCase().replace(" ", "_") ? order : "asc"}
                        onClick={() =>
                          handleRequestSort(head.toLowerCase().replace(" ", "_") as keyof SellerUser)
                        }
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
              {filteredSellerUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sellerUser) => (
                  <TableRow key={sellerUser.id} hover>
                    <TableCell>{sellerUser.username}</TableCell>
                    <TableCell>{sellerUser.email}</TableCell>
                    <TableCell>
                      <Chip label={sellerUser.role.toUpperCase()} color="secondary" />
                    </TableCell>
                    <TableCell>{sellerUser.seller_id}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(sellerUser.id)}>
                          <IconTrash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredSellerUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default SellerUserList;
