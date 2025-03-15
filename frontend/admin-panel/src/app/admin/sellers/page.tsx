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
  Switch,
  Chip,
  Alert,
  Snackbar,
  Button,
  Stack,
} from "@mui/material";
import { format } from "date-fns";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconX,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  activateSeller,
  deactivateSeller,
  deleteSeller,
  fetchSellers,
} from "../api/seller";
import { Seller } from "../types/seller";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import BlankCard from "@/app/components/shared/BlankCard";

const SellerList = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orderBy, setOrderBy] = useState<keyof Seller>("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch sellers with pagination, sorting, and search
  useEffect(() => {
    const loadSellers = async () => {
      try {
        const data = await fetchSellers(page + 1, rowsPerPage, search, orderBy, order);
        setSellers(data);
      } catch (error) {
        setError("Failed to fetch sellers. Please try again.");
      }
    };
    loadSellers();
  }, [page, rowsPerPage, search, orderBy, order]);

  // Sorting handler
  const handleRequestSort = (property: keyof Seller) => {
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

  // Action handlers
  const handleDelete = async (sellerId: string) => {
    if (confirm("Are you sure you want to delete this seller?")) {
      try {
        await deleteSeller(sellerId);
        setSellers((prev) => prev.filter((s) => s.id !== sellerId));
        setSuccess("Seller deleted successfully.");
      } catch (error) {
        setError("Failed to delete seller. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (sellerId: string, status: "Active" | "Inactive") => {
    try {
      if (status === "Active") {
        await deactivateSeller(sellerId);
        setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, status: "Inactive" } : s)));
        setSuccess("Seller deactivated successfully.");
      } else {
        await activateSeller(sellerId);
        setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, status: "Active" } : s)));
        setSuccess("Seller activated successfully.");
      }
    } catch (error) {
      setError("Failed to update seller status. Please try again.");
    }
  };

  // Close alerts
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <PageContainer title="Seller Management" description="This is table to manage sellers list">
      {/* Breadcrumb */}
      <Breadcrumb title="List of Sellers" />

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
            
            placeholder="Search Seller..."
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
            onClick={() => router.push("/admin/sellers/add")}
          >
            Add Seller
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Seller Name", "Owner Name", "Mobile", "Subscription Date", "Payment Status", "Status", "Actions"].map(
                  (head, index) => (
                    <TableCell key={index} align={index === 6 ? "center" : "left"}>
                      {index < 6 ? (
                        <TableSortLabel
                          active={orderBy === head.toLowerCase().replace(" ", "_")}
                          direction={orderBy === head.toLowerCase().replace(" ", "_") ? order : "asc"}
                          onClick={() => handleRequestSort(head.toLowerCase().replace(" ", "_") as keyof Seller)}
                        >
                          {head}
                        </TableSortLabel>
                      ) : (
                        head
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.id} hover>
                  <TableCell>{seller.seller_name}</TableCell>
                  <TableCell>{seller.owner_name}</TableCell>
                  <TableCell>{seller.seller_mobile}</TableCell>
                  <TableCell>{format(new Date(seller.renew_date), "yyyy-MM-dd")}</TableCell>
                  <TableCell>
                    <Chip
                      label={seller.payment_status}
                      color={
                        seller.payment_status === "Paid"
                          ? "success"
                          : seller.payment_status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={seller.status === "Active"}
                      onChange={() => handleToggleStatus(seller.id, seller.status)}
                      color={seller.status === "Active" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton onClick={() => router.push(`/admin/sellers/view/${seller.id}`)}>
                        <IconEye />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => router.push(`/admin/sellers/update/${seller.id}`)}>
                        <IconEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(seller.id)}>
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
          count={sellers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </BlankCard>
    </PageContainer>
  );
};

export default SellerList;