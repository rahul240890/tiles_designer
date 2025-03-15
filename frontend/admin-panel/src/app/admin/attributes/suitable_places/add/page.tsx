"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Grid, Stack } from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";

import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import ParentCard from "@/app/components/shared/ParentCard";
import { createSuitablePlace } from "@/api/suitablePlace";
import { useNotificationStore } from "@/store/notificationStore"; // ✅ Import Global Notification

// ✅ Validation Schema
const validationSchema = yup.object({
  name: yup.string().required("Suitable Place name is required"),
});

const AddSuitablePlace = () => {
  const router = useRouter();
  const showNotification = useNotificationStore((state) => state.showNotification); // ✅ Global Notification Hook
  const [loading, setLoading] = useState(false);

  // ✅ Formik for Handling Form State
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await createSuitablePlace(values);
        showNotification("Suitable Place added successfully!", "success"); // ✅ Success Notification
        formik.resetForm();
      } catch (error: any) {
        showNotification(error.message || "Error adding suitable place.", "error"); // ✅ Error Notification
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageContainer title="Add Suitable Place">
      <Breadcrumb title="Add Suitable Place" />
      <ParentCard title="Add New Suitable Place">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Suitable Place Name */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Suitable Place Name</CustomFormLabel>
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
            <Button color="error" variant="outlined" onClick={() => router.push("/admin/attributes/suitable_places")}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Suitable Place"}
            </Button>
          </Stack>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default AddSuitablePlace;
