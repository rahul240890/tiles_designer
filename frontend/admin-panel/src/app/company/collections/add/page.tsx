"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
  Typography,
  FormHelperText,
} from "@mui/material";

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import PageContainer from "@/app/components/container/PageContainer";
import { CollectionMetadataResponse } from "../../api/types";
import { fetchMetadata } from "../../api/metadata";
import { createCollection } from "../../api/collection";

const validationSchema = yup.object({
  name: yup.string().required("Collection name is required."),
  category_id: yup.number().required("Category is required."),
  size_id: yup.number().required("Size is required."),
  material_id: yup.number().required("Material is required."),
  finish_id: yup.number().required("Finish is required."),
  description: yup.string().nullable(),
});

const AddCollectionPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<CollectionMetadataResponse>({
    categories: [],
    sizes: [],
    materials: [],
    finishes: [],
    series: [],
  });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchMetadata();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };
    loadMetadata();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      category_id: "",
      size_id: "",
      material_id: "",
      finish_id: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createCollection(values);
        router.push("/company/collections/list");
      } catch (error) {
        console.error("Failed to create collection:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Add Collection" description="Create a new tile collection">
      <Typography variant="h4" gutterBottom>
        Add Collection
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <CustomTextField label="Collection Name" {...formik.getFieldProps("name")} error={formik.touched.name && Boolean(formik.errors.name)} />
          <CustomSelect label="Category" {...formik.getFieldProps("category_id")}>
            {metadata.categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </CustomSelect>
          <CustomSelect label="Size" {...formik.getFieldProps("size_id")}>
            {metadata.sizes.map((size) => (
              <MenuItem key={size.id} value={size.id}>
                {size.dimension}
              </MenuItem>
            ))}
          </CustomSelect>
          <CustomSelect label="Material" {...formik.getFieldProps("material_id")}>
            {metadata.materials.map((material) => (
              <MenuItem key={material.id} value={material.id}>
                {material.name}
              </MenuItem>
            ))}
          </CustomSelect>
          <CustomSelect label="Finish" {...formik.getFieldProps("finish_id")}>
            {metadata.finishes.map((finish) => (
              <MenuItem key={finish.id} value={finish.id}>
                {finish.name}
              </MenuItem>
            ))}
          </CustomSelect>
          <CustomTextField label="Description" {...formik.getFieldProps("description")} multiline rows={3} />
          <Button color="primary" variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create Collection"}
          </Button>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default AddCollectionPage;
