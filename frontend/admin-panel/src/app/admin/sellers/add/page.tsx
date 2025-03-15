"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Stack,
  MenuItem,
  FormHelperText,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";

import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { createSeller } from "../../api/seller";
import { SellerCreate } from "../../types/seller";
import { subscribe } from "diagnostics_channel";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import ParentCard from "@/app/components/shared/ParentCard";

// ✅ Validation Schema for Seller Form
const validationSchema = yup.object({
  seller_name: yup.string().required("Seller Name is required"),
  seller_mobile: yup
    .string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
  owner_name: yup.string().required("Owner Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be at least 8 characters long")
    .required("Password is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  gst_number: yup.string().nullable(),
  seller_type: yup
    .mixed<"Retailer" | "Distributor" | "Manufacturer">()
    .oneOf(["Retailer", "Distributor", "Manufacturer"], "Invalid Seller Type")
    .required("Seller Type is required"),
  plan_type: yup.string().nullable(),
  plan_price: yup.number().nullable(),
  payment_status: yup.string().required("Payment Status is required"),
  renew_date: yup.date().required("Renew Date is required"),
  next_billing_date: yup.date().required("Next Billing Date is required"),
  trial_period_end: yup.date().required("Trial Period Date is required"),
  subscribed_date: yup.date().required("Next Subscibed Date is required"),
  last_payment_date: yup.date().required("Next Last Payment Date is required"),
  max_users_allowed: yup.number().nullable(),
  notes: yup.string().nullable(),
  status: yup.string().required("Status is required"),
});

const AddSeller = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formik = useFormik<SellerCreate>({
    initialValues: {
      seller_name: "",
      seller_mobile: "",
      owner_name: "",
      email: "",
      password: "",
      address: "",
      city: "",
      gst_number: "",
      seller_type: "", // ✅ Fixed seller_type issue
      plan_type: "",
      plan_price: 0,
      payment_status: "Pending",
      renew_date: "",
      next_billing_date: "",
      subscribed_date: "",
      trial_period_end: "",
      last_payment_date: "",
      max_users_allowed: 0,
      notes: "",
      status: "Active",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await createSeller(values);
        router.push("/admin/seller"); // Redirect after success
      } catch (error: any) {
        setErrorMessage(error.message); // Show backend error in alert
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    
    <PageContainer title="Add New Seller" description="This is the form to add new seller ">
      {/* breadcrumb */}
      <Breadcrumb title="Add New Seller" />
      {/* end breadcrumb */}
       {/* Snackbar Alert for Error Messages */}
       <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
        <Alert variant="filled" severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <ParentCard title="Add New Seller">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Seller Name */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Seller Name</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="seller_name"
                name="seller_name"
                value={formik.values.seller_name}
                onChange={formik.handleChange}
                error={formik.touched.seller_name && Boolean(formik.errors.seller_name)}
                helperText={formik.touched.seller_name && formik.errors.seller_name}
              />
            </Grid>

            {/* Seller Mobile */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Seller Mobile</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="seller_mobile"
                name="seller_mobile"
                value={formik.values.seller_mobile}
                onChange={formik.handleChange}
                error={formik.touched.seller_mobile && Boolean(formik.errors.seller_mobile)}
                helperText={formik.touched.seller_mobile && formik.errors.seller_mobile}
              />
            </Grid>

            {/* Owner Name */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Owner Name</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="owner_name"
                name="owner_name"
                value={formik.values.owner_name}
                onChange={formik.handleChange}
                error={formik.touched.owner_name && Boolean(formik.errors.owner_name)}
                helperText={formik.touched.owner_name && formik.errors.owner_name}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Email</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={8}>
              <CustomFormLabel>Address</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>City</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            {/* GST Number */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>GST Number</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="gst_number"
                name="gst_number"
                value={formik.values.gst_number}
                onChange={formik.handleChange}
                error={formik.touched.gst_number && Boolean(formik.errors.gst_number)}
                helperText={formik.touched.gst_number && formik.errors.gst_number}
              />
            </Grid>

            {/* Seller Type */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Seller Type</CustomFormLabel>
              <CustomSelect
                fullWidth
                id="seller_type"
                name="seller_type"
                value={formik.values.seller_type || ""}
                onChange={formik.handleChange}
                error={formik.touched.seller_type && Boolean(formik.errors.seller_type)}
              >
                <MenuItem value="Retailer">Retailer</MenuItem>
                <MenuItem value="Distributor">Distributor</MenuItem>
                <MenuItem value="Manufacturer">Manufacturer</MenuItem>
              </CustomSelect>
              {formik.errors.seller_type && (
                <FormHelperText error>{formik.errors.seller_type}</FormHelperText>
              )}
            </Grid>

            {/* Plan Type */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Plan Type</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="plan_type"
                name="plan_type"
                value={formik.values.plan_type}
                onChange={formik.handleChange}
                error={formik.touched.plan_type && Boolean(formik.errors.plan_type)}
                helperText={formik.touched.plan_type && formik.errors.plan_type}
              />
            </Grid>

            {/* Plan Price */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Plan Price</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="plan_price"
                name="plan_price"
                value={formik.values.plan_price || ""}
                onChange={formik.handleChange}
                error={formik.touched.plan_price && Boolean(formik.errors.plan_price)}
                helperText={formik.touched.plan_price && formik.errors.plan_price}
              />
            </Grid>

            {/* Payment Status */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Payment Status</CustomFormLabel>
              <CustomSelect
                fullWidth
                id="payment_status"
                name="payment_status"
                value={formik.values.payment_status}
                onChange={formik.handleChange}
                error={formik.touched.payment_status && Boolean(formik.errors.payment_status)}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </CustomSelect>
              {formik.errors.payment_status && (
                <FormHelperText error>{formik.errors.payment_status}</FormHelperText>
              )}
            </Grid>

            {/* Renew Date */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Renew Date</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="renew_date"
                name="renew_date"
                value={formik.values.renew_date}
                onChange={formik.handleChange}
                error={formik.touched.renew_date && Boolean(formik.errors.renew_date)}
                helperText={formik.touched.renew_date && formik.errors.renew_date}
              />
            </Grid>

            {/* Next Billing Date */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Next Billing Date</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="next_billing_date"
                name="next_billing_date"
                value={formik.values.next_billing_date}
                onChange={formik.handleChange}
                error={formik.touched.next_billing_date && Boolean(formik.errors.next_billing_date)}
                helperText={formik.touched.next_billing_date && formik.errors.next_billing_date}
              />
            </Grid>

            {/* Trial Period End */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Subscription Date</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="subscribed_date"
                name="subscribed_date"
                value={formik.values.subscribed_date || ""}
                onChange={formik.handleChange}
                error={formik.touched.subscribed_date && Boolean(formik.errors.subscribed_date)}
                helperText={formik.touched.subscribed_date && formik.errors.subscribed_date}
              />
            </Grid>

            {/* Trial Period End */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Trial Period End</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="trial_period_end"
                name="trial_period_end"
                value={formik.values.trial_period_end || ""}
                onChange={formik.handleChange}
                error={formik.touched.trial_period_end && Boolean(formik.errors.trial_period_end)}
                helperText={formik.touched.trial_period_end && formik.errors.trial_period_end}
              />
            </Grid>

            {/* Last Payment Date */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Last Payment Date</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="date"
                id="last_payment_date"
                name="last_payment_date"
                value={formik.values.last_payment_date || ""}
                onChange={formik.handleChange}
                error={formik.touched.last_payment_date && Boolean(formik.errors.last_payment_date)}
                helperText={formik.touched.last_payment_date && formik.errors.last_payment_date}
              />
            </Grid>

            {/* Max Users Allowed */}
            <Grid item xs={12} md={4}>
              <CustomFormLabel>Max Users Allowed</CustomFormLabel>
              <CustomTextField
                fullWidth
                type="number"
                id="max_users_allowed"
                name="max_users_allowed"
                value={formik.values.max_users_allowed || ""}
                onChange={formik.handleChange}
                error={formik.touched.max_users_allowed && Boolean(formik.errors.max_users_allowed)}
                helperText={formik.touched.max_users_allowed && formik.errors.max_users_allowed}
              />
            </Grid>



            {/* Status */}
            <Grid item xs={12} md={3}>
              <CustomFormLabel>Status</CustomFormLabel>
              <CustomSelect
                fullWidth
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </CustomSelect>
            </Grid>


            {/* Password */}
            <Grid item xs={12} md={3}>
              <CustomFormLabel>Password</CustomFormLabel>
              <CustomTextField
                fullWidth
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12} md={6}>
              <CustomFormLabel>Notes</CustomFormLabel>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                id="notes"
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>

            <Stack direction="row" spacing={2} mt={4}>
              <Button
                color="primary"
                size = "large"
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth
              >
                {loading ? "Adding..." : "Add Seller"}
              </Button>
            </Stack>

          </Grid>
        </form>
      </ParentCard>

    </PageContainer>

  );
};

export default AddSeller;
