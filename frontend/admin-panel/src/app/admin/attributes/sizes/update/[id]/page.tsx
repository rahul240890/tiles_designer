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
import { TileSize } from "@/types/attributes";
import { getAttributes, updateAttribute } from "@/api/attributes";

// ✅ Validation Schema
const validationSchema = yup.object({
  length: yup.number().positive("Must be positive").required("Length is required"),
  width: yup.number().positive("Must be positive").required("Width is required"),
});

const EditSize = () => {
  const router = useRouter();
  const { id } = useParams();
  const sizeId = Array.isArray(id) ? id[0] : id; // ✅ Ensure it's a single string

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [size, setSize] = useState<TileSize | null>(null);

  // ✅ Fetch size details if editing
  useEffect(() => {
    const loadSize = async () => {
      if (sizeId) {
        try {
          const data = await getAttributes("sizes");
          const foundSize = data.find((sz: TileSize) => sz.id === sizeId);
          if (foundSize) {
            setSize(foundSize);
            const [length, width] = foundSize.name.split("x").map(Number); // ✅ Split size name
            formik.setValues({ length, width });
          } else {
            setSnackbarMessage("Size not found.");
            setOpenSnackbar(true);
            router.push("/admin/attributes/sizes");
          }
        } catch (error: any) {
          setSnackbarMessage(error.message || "Failed to fetch size.");
          setOpenSnackbar(true);
        }
      }
    };
    loadSize();
  }, [sizeId]);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      length: size ? Number(size.name.split("x")[0]) : "",
      width: size ? Number(size.name.split("x")[1]) : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const sizeName = `${values.length}x${values.width}`; // ✅ Combine fields

        if (sizeId) {
          await updateAttribute("sizes", sizeId, { name: sizeName });
          setSnackbarMessage("Size updated successfully!");
        }
        setOpenSnackbar(true);
        router.push("/admin/attributes/sizes");
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error updating size.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Edit Size">
      <Breadcrumb title="Edit Size" />
      <ParentCard title="Edit Size">
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

          <Stack direction="row" spacing={2} mt={4}>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Size"}
            </Button>
          </Stack>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EditSize;
