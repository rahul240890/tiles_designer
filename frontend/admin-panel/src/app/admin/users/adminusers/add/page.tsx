"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Grid,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import ParentCard from "@/app/components/shared/ParentCard";
import { UserCreate } from "../../../types/adminuser";
import { createAdmin } from "../../../api/adminusersAPI";

// ✅ Validation Schema
const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(8, "Password should be at least 8 characters long").required("Password is required"),
});

const AddAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formik = useFormik<UserCreate>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "admin",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await createAdmin(values);
        setSnackbarMessage("Admin user added successfully!");
        setOpenSnackbar(true);
        formik.resetForm();
      } catch (error) {
        setSnackbarMessage("Error adding admin user.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Add Admin User">
      <Breadcrumb title="Add Admin" />
      <ParentCard title="Add New Admin">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Username</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Email</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Password</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} mt={4}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => formik.resetForm()}
            >
              Reset
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => router.push("/admin/users/adminusers")}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Admin"}
            </Button>
          </Stack>
        </form>
      </ParentCard>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AddAdmin;
