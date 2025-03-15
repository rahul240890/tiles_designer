"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
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
import { getCollectionById, updateCollection } from "@/app/company/api/collection";
import { fetchMetadata } from "@/app/company/api/metadata";
import { CollectionMetadataResponse, TileCollection } from "@/app/company/api/types";

const validationSchema = yup.object({
  name: yup.string().required("Collection name is required."),
  category_id: yup.number().required("Category is required."),
  size_id: yup.number().required("Size is required."),
  material_id: yup.number().required("Material is required."),
  finish_id: yup.number().required("Finish is required."),
  description: yup.string().nullable(),
});

const EditCollectionPage = () => {
  const router = useRouter();
  const params = useParams();
  const collectionId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<CollectionMetadataResponse>({
    categories: [],
    sizes: [],
    materials: [],
    finishes: [],
    series: [],
  });

  const [initialValues, setInitialValues] = useState<TileCollection>({
    id: collectionId,
    name: "",
    category_id: 0,
    size_id: 0,
    material_id: 0,
    finish_id: 0,
    description: "",
  });

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        const collectionData = await getCollectionById(collectionId);
        setInitialValues(collectionData);
      } catch (error) {
        console.error("Failed to fetch collection data:", error);
      }
    };

    const loadMetadata = async () => {
      try {
        const metadataData = await fetchMetadata();
        setMetadata(metadataData);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };

    fetchCollectionData();
    loadMetadata();
    setLoading(false);
  }, [collectionId]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateCollection(collectionId, values);
        router.push("/company/collections/list");
      } catch (error) {
        console.error("Failed to update collection:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (loading) return <CircularProgress />;

  return (
    <PageContainer title="Edit Collection" description="Update tile collection details">
      <Typography variant="h4" gutterBottom>
        Edit Collection
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
            {loading ? <CircularProgress size={24} /> : "Update Collection"}
          </Button>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default EditCollectionPage;
