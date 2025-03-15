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
import { createAttribute } from "@/api/attributes";

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Finishing name is required"),
});

const AddFinishing = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await createAttribute("finishes", values);
        setSnackbarMessage("Finishing added successfully!");
        setOpenSnackbar(true);
        formik.resetForm();
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error adding finishing.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Add Finishing">
      <Breadcrumb title="Add Finishing" />
      <ParentCard title="Add New Finishing">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Finishing Name */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Finishing Name</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} mt={4}>
            <Button color="secondary" variant="outlined" onClick={() => formik.resetForm()}>
              Reset
            </Button>
            <Button color="error" variant="outlined" onClick={() => router.push("/admin/attributes/finishing")}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Finishing"}
            </Button>
          </Stack>
        </form>
      </ParentCard>

      {/* ✅ Snackbar Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AddFinishing;
