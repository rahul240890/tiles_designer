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
  length: yup.number().positive("Must be positive").required("Length is required"),
  width: yup.number().positive("Must be positive").required("Width is required"),
});

const AddSize = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      length: "",
      width: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const sizeName = `${values.length} x ${values.width}`; // ✅ Combine fields

        await createAttribute("sizes", { name: sizeName });
        setSnackbarMessage("Size added successfully!");
        setOpenSnackbar(true);
        formik.resetForm();
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error adding size.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Add Size">
      <Breadcrumb title="Add Size" />
      <ParentCard title="Add New Size">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Length */}
            <Grid item xs={6} md={4}>
              <CustomFormLabel>Length (mm)</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="length"
                name="length"
                type="number"
                value={formik.values.length}
                onChange={formik.handleChange}
                error={formik.touched.length && Boolean(formik.errors.length)}
                helperText={formik.touched.length && formik.errors.length}
              />
            </Grid>

            {/* Width */}
            <Grid item xs={6} md={4}>
              <CustomFormLabel>Width (mm)</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="width"
                name="width"
                type="number"
                value={formik.values.width}
                onChange={formik.handleChange}
                error={formik.touched.width && Boolean(formik.errors.width)}
                helperText={formik.touched.width && formik.errors.width}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} mt={4}>
            <Button color="secondary" variant="outlined" onClick={() => formik.resetForm()}>
              Reset
            </Button>
            <Button color="error" variant="outlined" onClick={() => router.push("/admin/attributes/sizes")}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Size"}
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

export default AddSize;
