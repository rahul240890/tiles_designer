"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Box, Button, Grid, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNotificationStore } from "@/store/notificationStore";
import Autocomplete from "@mui/material/Autocomplete";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { getAllAttributes, createCollection, fetchSuitablePlaces } from "../../api/collection";
import { getSellerId } from "@/utils/cookieuserdata";
import AttributeModal from "./AttributeModal";
import ParentCard from "@/app/components/shared/ParentCard";
import PageContainer from "@/app/components/container/PageContainer";

// ✅ Define Type
type Attribute = { id: string; name: string };

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Collection Name is required *"),
  category_id: yup.string().required("Category is required *"),
  size_id: yup.string().required("Size is required *"),
  series_id: yup.string().nullable(),
  material_id: yup.string().nullable(),
  finish_id: yup.string().nullable(),
  description: yup.string().nullable(),
  suitable_places: yup.array().of(yup.string()).nullable(), // ✅ Validate Suitable Places

});

const CreateCollection = () => {
  const router = useRouter();
  const { showNotification } = useNotificationStore();
  const [seller_id, setSellerId] = useState<string | null>(null);

  // ✅ State for attributes
  const [attributes, setAttributes] = useState<{
    sizes: Attribute[];
    series: Attribute[];
    materials: Attribute[];
    finishes: Attribute[];
    categories: Attribute[];
    suitable_places: Attribute[]; // ✅ Added Suitable Places
  }>({
    sizes: [],
    series: [],
    materials: [],
    finishes: [],
    categories: [],
    suitable_places: [], // ✅ Initialize Suitable Places
  });

  // ✅ Modal State
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [modalType, setModalType] = useState<"sizes" | "series" | "materials" | "finishes" | null>(null);

  // ✅ Fetch `seller_id` on mount
  useEffect(() => {
    async function fetchSellerId() {
      const id = await getSellerId();
      if (id) {
        setSellerId(id);
      } else {
        showNotification("Seller ID is missing or invalid", "error");
      }
    }
    fetchSellerId();
  }, []);

  // ✅ Fetch attributes on page load
  useEffect(() => {
    async function loadAttributes() {
      try {
        const response = await getAllAttributes();
        const places = await fetchSuitablePlaces(); // ✅ Fetch Suitable Places

        if (response && typeof response === "object") {
          setAttributes({
            sizes: response.sizes || [],
            series: response.series || [],
            materials: response.materials || [],
            finishes: response.finishes || [],
            categories: response.categories || [],
            suitable_places: places || [], // ✅ Store Suitable Places
          });
        } else {
          showNotification("Failed to load attributes", "error");
        }
      } catch (error) {
        showNotification("Error fetching attributes", "error");
      }
    }
    loadAttributes();
  }, []);

  // ✅ Handle Modal
  const handleOpenModal = (type: "sizes" | "series" | "materials" | "finishes") => {
    setModalType(type);
    setOpenModal(true);
  };

  const handleAttributeAdded = (newAttribute: { id: string; name: string }) => {
    if (!modalType) return;

    setAttributes((prev) => ({
      ...prev,
      [modalType as keyof typeof prev]: [...(prev[modalType as keyof typeof prev] || []), newAttribute],
    }));
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // ✅ Formik Configuration
  const formik = useFormik({
    initialValues: {
      name: "",
      category_id: "",
      size_id: "",
      series_id: null,
      material_id: null,
      suitable_places: [] as string[], // ✅ Explicitly define as string[]
      finish_id: null,
      description: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!seller_id) {
        showNotification("Seller ID is missing or invalid", "error");
        return;
      }
      setSubmitting(true); // ✅ Disable button on submit
      const collectionData = { ...values, seller_id };

      try {
        const response = await createCollection(collectionData);
        if (!response.error) {
          showNotification("Collection created successfully!", "success");
          router.push("/sellers/collections/list");
        } else {
          showNotification(response.error, "error");
        }
      } catch (error) {
        showNotification("Failed to create collection", "error");
      } finally {
        setSubmitting(false); // ✅ Enable button after request is processed
      }
    },
  });

  return (
    <PageContainer title="New Collection" description="Create a new tile collection">
      <ParentCard title="Create New Collection">
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={0} columnSpacing={2}>

            {/* ✅ Collection Name */}
            <Grid item xs={6}>
              <CustomFormLabel>Collection Name <span style={{ color: "red" }}>*</span></CustomFormLabel>
              <CustomTextField
                fullWidth
                name="name"
                placeholder="Enter collection name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            {/* ✅ Category */}
            <Grid item xs={6}>
              <CustomFormLabel>Category <span style={{ color: "red" }}>*</span></CustomFormLabel>
              <Autocomplete
                options={attributes.categories}
                getOptionLabel={(option) => option.name}
                value={attributes.categories.find((c) => c.id === formik.values.category_id) || null}
                onChange={(_, newValue) => formik.setFieldValue("category_id", newValue ? newValue.id : "")}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    fullWidth
                    error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                    placeholder="Select category"
                    helperText={formik.touched.category_id && formik.errors.category_id}
                  />
                )}

              />
            </Grid>

            {/* ✅ Size Field */}
            <Grid item xs={6}>
              <CustomFormLabel>Size <span style={{ color: "red" }}>*</span></CustomFormLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={attributes.sizes}
                  getOptionLabel={(option) => option.name}
                  value={attributes.sizes.find((s) => s.id === formik.values.size_id) || null}
                  onChange={(_, newValue) => formik.setFieldValue("size_id", newValue ? newValue.id : "")}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      fullWidth
                      placeholder="Select tile size"
                      error={formik.touched.size_id && Boolean(formik.errors.size_id)}
                      helperText={formik.touched.size_id && formik.errors.size_id}
                    />
                  )}
                />
                <IconButton onClick={() => handleOpenModal("sizes")}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* ✅ Series Field */}
            <Grid item xs={6}>
              <CustomFormLabel>Series</CustomFormLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={attributes.series}
                  getOptionLabel={(option) => option.name}
                  value={attributes.series.find((s) => s.id === formik.values.series_id) || null}
                  onChange={(_, newValue) => formik.setFieldValue("series_id", newValue ? newValue.id : null)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth placeholder="Select or add a series"  />}
                />
                <IconButton onClick={() => handleOpenModal("series")}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* ✅ Material Field */}
            <Grid item xs={6}>
              <CustomFormLabel>Material</CustomFormLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={attributes.materials}
                  getOptionLabel={(option) => option.name}
                  value={attributes.materials.find((m) => m.id === formik.values.material_id) || null}
                  onChange={(_, newValue) => formik.setFieldValue("material_id", newValue ? newValue.id : null)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth placeholder="Select or add material" />}
                />
                <IconButton onClick={() => handleOpenModal("materials")}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* ✅ Finish Field */}
            <Grid item xs={6}>
              <CustomFormLabel>Finish</CustomFormLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={attributes.finishes}
                  getOptionLabel={(option) => option.name}
                  value={attributes.finishes.find((f) => f.id === formik.values.finish_id) || null}
                  onChange={(_, newValue) => formik.setFieldValue("finish_id", newValue ? newValue.id : null)}
                  renderInput={(params) => <CustomTextField {...params} fullWidth placeholder="Select or add finish" />}
                />
                <IconButton onClick={() => handleOpenModal("finishes")}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* ✅ Suitable Places (Multi-Select) */}
            <Grid item xs={12}>
              <CustomFormLabel>Suitable Places</CustomFormLabel>
              <Autocomplete
                multiple
                options={attributes.suitable_places}
                getOptionLabel={(option) => option.name}
                value={attributes.suitable_places.filter((p) => formik.values.suitable_places.includes(p.id))}
                onChange={(_, newValue) => formik.setFieldValue("suitable_places", newValue.map((p) => p.id))}
                renderInput={(params) => <CustomTextField {...params} fullWidth placeholder="Select suitable places" />}
              />
            </Grid>
            {/* ✅ Description */}
            <Grid item xs={12}>
              <CustomFormLabel>Description</CustomFormLabel>
              <CustomTextField
                fullWidth
                name="description"
                placeholder="Enter collection description"
                value={formik.values.description}
                onChange={formik.handleChange}
                multiline
                rows={1}
              />
            </Grid>

            {/* ✅ Submit Button */}
            <Grid item xs={12} textAlign="right" mt={5}>
              <Button
                variant="outlined"
                size="large"
                sx={{ mr: 2 }} // ✅ Adds spacing between buttons
                onClick={() => router.push("/sellers/collections/list")} // ✅ Redirects back to the list
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Create New Collection"}
              </Button>

            </Grid>
          </Grid>

          {/* ✅ Attribute Modal for Adding New Attributes */}
          {modalType && (
            <AttributeModal open={openModal} onClose={handleCloseModal} type={modalType} onSuccess={handleAttributeAdded} />
          )}
        </form>

      </ParentCard>
    </PageContainer>
  );
};

export default CreateCollection;
