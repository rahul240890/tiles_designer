"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, TextField, Button, MenuItem, Grid } from "@mui/material";
import { Tile } from "../types";

interface TileFormProps {
  onSubmit: (tileData: Omit<Tile, "id">) => void;
}

export default function TileForm({ onSubmit }: TileFormProps) {
  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      series: "",
      collection: "",
      type: "",
      material: "",
      finish: "",
      size: "",
      color: "",
      price: "",
      image_url: "",
      status: "Active" as "Active" | "Inactive", // ✅ Explicitly define status type
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      category: Yup.string().required("Category is required"),
      series: Yup.string().required("Series is required"),
      collection: Yup.string().required("Collection is required"),
      type: Yup.string().required("Tile Type is required"),
      material: Yup.string().required("Material is required"),
      finish: Yup.string().required("Finish is required"),
      size: Yup.string().required("Size is required"),
      color: Yup.string().required("Color is required"),
      price: Yup.number().required("Price is required").min(0, "Price must be positive"),
      status: Yup.mixed<"Active" | "Inactive">().oneOf(["Active", "Inactive"]).required("Status is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tile Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Tile Status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Save Tile
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
