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
import { format } from "date-fns";
import { IconEdit, IconTrash, IconSearch, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import BlankCard from "@/app/components/shared/BlankCard";
import { User } from "../../types/adminuser";
import { deleteAdmin, fetchAdmins } from "../../api/adminusersAPI";

const AdminList = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [orderBy, setOrderBy] = useState<keyof User>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch Admin Users
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (error) {
        setError("Failed to fetch admins. Please try again.");
      }
    };
    loadAdmins();
  }, []);

  // Sorting handler
  const handleRequestSort = (property: keyof User) => {
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

  // Filtered Admin Users
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  // Action handlers
  const handleDelete = async (adminId: number) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin(adminId);
        setAdmins((prev) => prev.filter((a) => a.id !== adminId));
        setSuccess("Admin user deleted successfully.");
      } catch (error) {
        setError("Failed to delete admin user. Please try again.");
      }
    }
  };

  // Close alerts
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <PageContainer title="Admin Management" description="List of all admin users">
      {/* Breadcrumb */}
      <Breadcrumb title="List of Admin Users" />

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
            placeholder="Search Admin..."
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
            onClick={() => router.push("/admin/users/adminusers/add")}
          >
            Add Admin
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Username", "Email", "Role", "Created At", "Actions"].map((head, index) => (
                  <TableCell key={index} align={index === 4 ? "center" : "left"}>
                    {index < 4 ? (
                      <TableSortLabel
                        active={orderBy === head.toLowerCase().replace(" ", "_")}
                        direction={orderBy === head.toLowerCase().replace(" ", "_") ? order : "asc"}
                        onClick={() =>
                          handleRequestSort(head.toLowerCase().replace(" ", "_") as keyof User)
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
              {filteredAdmins
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={admin.role.toUpperCase()}
                        color={admin.role === "admin" ? "primary" : "secondary"}
                      />
                    </TableCell>
                    <TableCell>issue</TableCell>
                    <TableCell align="center">
                      
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(admin.id)}>
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
          count={filteredAdmins.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default AdminList;
