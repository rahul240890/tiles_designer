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
import { TileMaterial } from "@/types/attributes";
import { getAttributes, updateAttribute } from "@/api/attributes";

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Material name is required"),
});

const EditMaterial = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const materialId = Array.isArray(id) ? id[0] : id; // ✅ Ensure it's a single string

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [material, setMaterial] = useState<TileMaterial | null>(null);

  // ✅ Fetch material details if editing
  useEffect(() => {
    const loadMaterial = async () => {
      if (materialId) {
        try {
          const data = await getAttributes("materials");
          const foundMaterial = data.find((mat: TileMaterial) => mat.id === materialId);
          if (foundMaterial) {
            setMaterial(foundMaterial);
            formik.setValues({ name: foundMaterial.name });
          } else {
            setSnackbarMessage("Material not found.");
            setOpenSnackbar(true);
            router.push("/admin/attributes/materials");
          }
        } catch (error: any) {
          setSnackbarMessage(error.message || "Failed to fetch material.");
          setOpenSnackbar(true);
        }
      }
    };
    loadMaterial();
  }, [materialId]);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: material ? material.name : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (materialId) {
          await updateAttribute("materials", materialId, values);
          setSnackbarMessage("Material updated successfully!");
        }
        setOpenSnackbar(true);
        router.push("/admin/attributes/materials");
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error updating material.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Edit Material">
      <Breadcrumb title="Edit Material" />
      <ParentCard title="Edit Material">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Material Name */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Material Name</CustomFormLabel>
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
            <Button color="error" variant="outlined" onClick={() => router.push("/admin/attributes/materials")}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Material"}
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

export default EditMaterial;
