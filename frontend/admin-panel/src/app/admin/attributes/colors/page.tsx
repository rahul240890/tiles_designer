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
  TablePagination,
  Snackbar,
  Alert,
  Button,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import BlankCard from "@/app/components/shared/BlankCard";
import { TileColor } from "@/types/attributes";
import { getAttributes, deleteAttribute } from "@/api/attributes";

const ColorList = () => {
  const [colors, setColors] = useState<TileColor[]>([]);
  const [orderBy, setOrderBy] = useState<keyof TileColor>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Fetch Colors
  useEffect(() => {
    const loadColors = async () => {
      try {
        const data = await getAttributes("colors");
        setColors(data);
      } catch (error: any) {
        setError(error.message || "Failed to fetch colors. Please try again.");
      }
    };
    loadColors();
  }, []);

  // ✅ Sorting Handler
  const handleRequestSort = (property: keyof TileColor) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  // ✅ Delete Color with Confirmation
  const handleDelete = async (colorId: string) => {
    if (confirm("Are you sure you want to delete this color?")) {
      try {
        await deleteAttribute("colors", colorId);
        setColors((prev) => prev.filter((c) => c.id !== colorId));
        setSuccess("Color deleted successfully.");
      } catch (error: any) {
        setError(error.message || "Failed to delete color. Please try again.");
      }
    }
  };

  // ✅ Close Alerts
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <PageContainer title="Color Management" description="List of all colors">
      {/* ✅ Breadcrumb */}
      <Breadcrumb title="List of Colors" />

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
        {/* ✅ Add Button */}
        <Stack direction="row" spacing={2} sx={{ p: 2, mb: 2 }} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<IconPlus />}
            onClick={() => router.push("/admin/attributes/colors/add")}
          >
            Add Color
          </Button>
        </Stack>

        {/* ✅ Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Color Preview", "Color Name & HEX", "Actions"].map((head, index) => (
                  <TableCell key={index} align={index === 2 ? "center" : "left"}>
                    {index === 1 ? (
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
              {colors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((color) => (
                <TableRow key={color.id} hover>
                  {/* Color Preview */}
                  <TableCell>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: color.hex_code,
                        border: "1px solid #ccc",
                      }}
                    />
                  </TableCell>

                  {/* Name & HEX Code */}
                  <TableCell>
                    <Typography variant="subtitle1">{color.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {color.hex_code}
                    </Typography>
                  </TableCell>

                  {/* Actions (Only Delete Button) */}
                  <TableCell align="center">
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(color.id)}>
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
          count={colors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default ColorList;
