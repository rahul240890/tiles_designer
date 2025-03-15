"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { TileSeries } from "@/types/attributes";
import { getAttributes, updateAttribute } from "@/api/attributes";

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Series name is required"),
});

const EditSeries = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const seriesId = Array.isArray(id) ? id[0] : id; // ✅ Ensure it's a single string

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [series, setSeries] = useState<TileSeries | null>(null);

  // ✅ Fetch series details if editing
  useEffect(() => {
    const loadSeries = async () => {
      if (seriesId) {
        try {
          const data = await getAttributes("series");
          const foundSeries = data.find((ser: TileSeries) => ser.id === seriesId);
          if (foundSeries) {
            setSeries(foundSeries);
            formik.setValues({ name: foundSeries.name });
          } else {
            setSnackbarMessage("Series not found.");
            setOpenSnackbar(true);
            router.push("/admin/attributes/series");
          }
        } catch (error: any) {
          setSnackbarMessage(error.message || "Failed to fetch series.");
          setOpenSnackbar(true);
        }
      }
    };
    loadSeries();
  }, [seriesId]);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: series ? series.name : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (seriesId) {
          await updateAttribute("series", seriesId, values);
          setSnackbarMessage("Series updated successfully!");
        }
        setOpenSnackbar(true);
        router.push("/admin/attributes/series");
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error updating series.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Edit Series">
      <Breadcrumb title="Edit Series" />
      <ParentCard title="Edit Series">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Series Name */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Series Name</CustomFormLabel>
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
            <Button color="error" variant="outlined" onClick={() => router.push("/admin/attributes/series")}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Series"}
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

export default EditSeries;
