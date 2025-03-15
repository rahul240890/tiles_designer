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
import { TileCategory } from "@/types/attributes";
import { getAttributes, updateAttribute } from "@/api/attributes";

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Category name is required"),
});

const EditCategory = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const categoryId = Array.isArray(id) ? id[0] : id; // ✅ Ensure it's a single string

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [category, setCategory] = useState<TileCategory | null>(null);

  // ✅ Fetch category details if editing
  useEffect(() => {
    const loadCategory = async () => {
      if (categoryId) {
        try {
          const data = await getAttributes("categories");
          const foundCategory = data.find((cat: TileCategory) => cat.id === categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
            formik.setValues({ name: foundCategory.name });
          } else {
            setSnackbarMessage("Category not found.");
            setOpenSnackbar(true);
            router.push("/admin/attributes/categories");
          }
        } catch (error: any) {
          setSnackbarMessage(error.message || "Failed to fetch category.");
          setOpenSnackbar(true);
        }
      }
    };
    loadCategory();
  }, [categoryId]);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: category ? category.name : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (categoryId) {
          await updateAttribute("categories", categoryId, values);
          setSnackbarMessage("Category updated successfully!");
        }
        setOpenSnackbar(true);
        router.push("/admin/attributes/categories");
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error updating category.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Edit Category">
      <Breadcrumb title="Edit Category" />
      <ParentCard title="Edit Category">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Category Name */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Category Name</CustomFormLabel>
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
            <Button color="error" variant="outlined" onClick={() => router.push("/admin/attributes/categories")}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Category"}
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

export default EditCategory;
