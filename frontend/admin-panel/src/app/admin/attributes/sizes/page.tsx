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
import { TileSize } from "@/types/attributes";
import { getAttributes, deleteAttribute } from "@/api/attributes";

const SizeList = () => {
  const [sizes, setSizes] = useState<TileSize[]>([]);
  const [orderBy, setOrderBy] = useState<keyof TileSize>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Fetch Tile Sizes
  useEffect(() => {
    const loadSizes = async () => {
      try {
        const data = await getAttributes("sizes");
        setSizes(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch sizes. Please try again.");
      }
    };
    loadSizes();
  }, []);

  // ✅ Sorting Handler
  const handleRequestSort = (property: keyof TileSize) => {
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

  // ✅ Filtered Tile Sizes
  const filteredSizes = sizes.filter((size) =>
    size.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Delete Size with Confirmation
  const handleDelete = async (sizeId: string) => {
    if (confirm("Are you sure you want to delete this size?")) {
      try {
        await deleteAttribute("sizes", sizeId);
        setSizes((prev) => prev.filter((s) => s.id !== sizeId));
        setSuccess("Size deleted successfully.");
      } catch (error: any) {
        setError(error.message || "Failed to delete size. Please try again.");
      }
    }
  };

  // ✅ Close Alerts
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <PageContainer title="Size Management" description="List of all tile sizes">
      {/* ✅ Breadcrumb */}
      <Breadcrumb title="List of Sizes" />

      {/* ✅ Alerts for Error & Success */}
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
        {/* ✅ Search & Add Button */}
        <Stack direction="row" spacing={2} sx={{ p: 2, mb: 2 }} alignItems="center">
          <TextField
            placeholder="Search Sizes..."
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
            onClick={() => router.push("/admin/attributes/sizes/add")}
          >
            Add Size
          </Button>
        </Stack>

        {/* ✅ Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Size (Length x Width)", "Actions"].map((head, index) => (
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
              {filteredSizes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((size) => (
                  <TableRow key={size.id} hover>
                    <TableCell>{size.name}mm</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => router.push(`/admin/attributes/sizes/update/${size.id}`)}
                        >
                          <IconEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(size.id)}>
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
          count={filteredSizes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default SizeList;
