"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { Box, Button, Grid, Typography, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNotificationStore } from "@/store/notificationStore";
import Autocomplete from "@mui/material/Autocomplete";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { fetchSuitablePlaces, getAllAttributes, getCollectionById, updateCollection } from "../../../api/collection";
import ParentCard from "@/app/components/shared/ParentCard";
import PageContainer from "@/app/components/container/PageContainer";
import AttributeModal from "../../create/AttributeModal";

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
    suitable_places: yup.array().of(yup.string()).nullable(), // ✅ Added Suitable Places Validation

});

const EditCollection = () => {
    const router = useRouter();
    const params = useParams();
    const collectionId = params?.id as string;
    const { showNotification } = useNotificationStore();

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
    const [modalType, setModalType] = useState<"sizes" | "series" | "materials" | "finishes" | null>(null);

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

    // ✅ Fetch Collection Data by ID
    useEffect(() => {
        async function fetchCollection() {
            if (!collectionId) return;

            try {
                const response = await getCollectionById(collectionId);
                if (response) {
                    formik.setValues({
                        name: response.name,
                        category_id: response.category.id,
                        size_id: response.size.id,
                        series_id: response.series?.id || "",
                        material_id: response.material?.id || "",
                        finish_id: response.finish?.id || "",
                        description: response.description || "",
                        suitable_places: response.suitable_places.map((p) => p.id) || [], // ✅ Populate Suitable Places
                    });
                } else {
                    showNotification("Collection not found!", "error");
                    router.push("/sellers/collections/list");
                }
            } catch (error) {
                showNotification("Error fetching collection", "error");
                router.push("/sellers/collections/list");
            }
        }
        fetchCollection();
    }, [collectionId]);

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
            series_id: "" as string | null,
            material_id: "" as string | null,
            finish_id: "" as string | null,
            description: "",
            suitable_places: [] as string[], // ✅ Initialize Suitable Places
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values) => {
            try {
                const response = await updateCollection(collectionId, values);
                if (!response.error) {
                    showNotification("Collection updated successfully!", "success");
                    router.push("/sellers/collections/list");
                } else {
                    showNotification(response.error, "error");
                }
            } catch (error) {
                showNotification("Failed to update collection", "error");
            }
        },
    });

    return (
        <PageContainer title="Edit Collection" description="Modify existing collection details">
            <ParentCard title="Edit Collection">

                <form onSubmit={formik.handleSubmit}>
                    <Grid container rowSpacing={0} columnSpacing={5}>

                        {/* ✅ Collection Name */}
                        <Grid item xs={6}>
                            <CustomFormLabel>Collection Name <span style={{ color: "red" }}>*</span></CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                name="name"
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
                                renderInput={(params) => <CustomTextField {...params} fullWidth />}
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
                                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
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
                                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
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
                                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
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
                                    renderInput={(params) => <CustomTextField {...params} fullWidth />}
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
                                value={attributes.suitable_places.filter((p) => (formik.values.suitable_places as string[]).includes(p.id))}
                                onChange={(_, newValue) => formik.setFieldValue("suitable_places", newValue.map((p) => p.id) as string[])}
                                renderInput={(params) => <CustomTextField {...params} fullWidth />}
                            />
                        </Grid>

                        {/* ✅ Description */}
                        <Grid item xs={12}>
                            <CustomFormLabel>Description</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                multiline
                                rows={3}
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
                            <Button type="submit" variant="contained" size="large">
                                Update Collection
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

export default EditCollection;
