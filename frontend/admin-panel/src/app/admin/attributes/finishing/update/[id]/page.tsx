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
import { TileFinish } from "@/types/attributes";
import { getAttributes, updateAttribute } from "@/api/attributes";

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Finishing name is required"),
});

const EditFinishing = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const finishId = Array.isArray(id) ? id[0] : id; // ✅ Ensure it's a single string

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [finish, setFinish] = useState<TileFinish | null>(null);

  // ✅ Fetch finishing details if editing
  useEffect(() => {
    const loadFinishing = async () => {
      if (finishId) {
        try {
          const data = await getAttributes("finishes");
          const foundFinish = data.find((f: TileFinish) => f.id === finishId);
          if (foundFinish) {
            setFinish(foundFinish);
            formik.setValues({ name: foundFinish.name });
          } else {
            setSnackbarMessage("Finishing not found.");
            setOpenSnackbar(true);
            router.push("/admin/attributes/finishes");
          }
        } catch (error: any) {
          setSnackbarMessage(error.message || "Failed to fetch finishing.");
          setOpenSnackbar(true);
        }
      }
    };
    loadFinishing();
  }, [finishId]);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: finish ? finish.name : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (finishId) {
          await updateAttribute("finishes", finishId, values);
          setSnackbarMessage("Finishing updated successfully!");
        }
        setOpenSnackbar(true);
        router.push("/admin/attributes/finishing");
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error updating finishing.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Edit Finishing">
      <Breadcrumb title="Edit Finishing" />
      <ParentCard title="Edit Finishing">
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
              {loading ? "Updating..." : "Update Finishing"}
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

export default EditFinishing;
