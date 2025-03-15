"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Grid,
  Stack,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { SketchPicker } from "react-color";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import ParentCard from "@/app/components/shared/ParentCard";
import { createAttribute } from "@/api/attributes";
import { colorDictionary } from "@/utils/colorDictionary";

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Color name is required"),
  hex_code: yup
    .string()
    .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX code")
    .required("HEX code is required"),
});

const AddColor = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: "",
      hex_code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await createAttribute("colors", values);
        setSnackbarMessage("Color added successfully!");
        setOpenSnackbar(true);
        formik.resetForm();
      } catch (error: any) {
        setSnackbarMessage(error.message || "Error adding color.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Handle Autocomplete Selection
  const handleColorSelect = (_event: any, selectedColor: { label: string; hex: string } | null) => {
    if (selectedColor) {
      formik.setFieldValue("name", selectedColor.label);
      formik.setFieldValue("hex_code", selectedColor.hex);
    }
  };

  // ✅ Handle Manual HEX Code Change via Color Picker
  const handleColorPickerChange = (color: any) => {
    formik.setFieldValue("hex_code", color.hex);
  };

  return (
    <PageContainer title="Add Color">
      <Breadcrumb title="Add Color" />
      <ParentCard title="Add New Color">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Color Name - Autocomplete */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Color Name</CustomFormLabel>
              <Autocomplete
                options={colorDictionary}
                getOptionLabel={(option) => option.label}
                onChange={handleColorSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Select or enter color name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={(e) => formik.setFieldValue("name", e.target.value)}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                )}
              />
            </Grid>

            {/* HEX Code - TextField & Color Picker */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>HEX Code</CustomFormLabel>
              <TextField
                fullWidth
                id="hex_code"
                name="hex_code"
                value={formik.values.hex_code}
                onChange={formik.handleChange}
                error={formik.touched.hex_code && Boolean(formik.errors.hex_code)}
                helperText={formik.touched.hex_code && formik.errors.hex_code}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="outlined"
                      onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    >
                      🎨 Pick Color
                    </Button>
                  ),
                }}
              />
            </Grid>

            {/* Color Preview */}
            {formik.values.hex_code && (
              <Grid item xs={12} md={6}>
                <CustomFormLabel>Selected Color Preview</CustomFormLabel>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: formik.values.hex_code,
                    border: "2px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="white">
                    {formik.values.hex_code}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* Color Picker Component */}
            {colorPickerOpen && (
              <Grid item xs={12}>
                <SketchPicker
                  color={formik.values.hex_code}
                  onChange={handleColorPickerChange}
                />
              </Grid>
            )}
          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} mt={4}>
            <Button color="secondary" variant="outlined" onClick={() => formik.resetForm()}>
              Reset
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => router.push("/admin/attributes/colors")}
            >
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Color"}
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

export default AddColor;
