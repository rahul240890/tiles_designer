"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    Box,
    Button,
    Stack,
    MenuItem,
    FormHelperText,
    Grid,
    Typography,
} from "@mui/material";

import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { fetchSellerById, updateSeller } from "@/app/admin/api/seller";
import { SellerUpdate } from "@/app/admin/types/seller";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/layout/shared/breadcrumb/Breadcrumb";
import ParentCard from "@/app/components/shared/ParentCard";

// Utility function to format dates to YYYY-MM-DD
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Handle invalid dates
    return date.toISOString().split("T")[0];
};

// ✅ Validation Schema for Edit Seller Form
const validationSchema = yup.object({
    seller_name: yup.string().required("Seller Name is required"),
    seller_mobile: yup
        .string()
        .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    owner_name: yup.string().required("Owner Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
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
    renew_date: yup.string().required("Renew Date is required"),
    next_billing_date: yup.string().required("Next Billing Date is required"),
    trial_period_end: yup.string().nullable(),
    subscribed_date: yup.string().nullable(),
    last_payment_date: yup.string().nullable(),
    max_users_allowed: yup.number().nullable(),
    notes: yup.string().nullable(),
    status: yup.string().required("Status is required"),
});

const EditSeller = () => {
    const router = useRouter();
    const { id } = useParams(); // Get seller ID from URL
    const [loading, setLoading] = useState(false);
    const [sellerData, setSellerData] = useState<SellerUpdate | null>(null);

    // Fetch Seller Details by ID
    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const seller = await fetchSellerById(String(id));
                setSellerData({
                    ...seller,
                    renew_date: formatDate(seller.renew_date),
                    next_billing_date: formatDate(seller.next_billing_date),
                    subscribed_date: formatDate(seller.subscribed_date),
                    trial_period_end: formatDate(seller.trial_period_end),
                    last_payment_date: formatDate(seller.last_payment_date),
                    payment_status: seller.payment_status || "Pending", // ✅ Ensuring default value
                });
            } catch (error) {
                console.error("Failed to fetch seller:", error);
            }
        };
        fetchSeller();
    }, [id]);

    // Initialize form only after data is fetched
    const formik = useFormik<SellerUpdate>({
        enableReinitialize: true,
        initialValues: sellerData || {
            seller_name: "",
            seller_mobile: "",
            owner_name: "",
            email: "",
            address: "",
            city: "",
            gst_number: "",
            seller_type: "",
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

                await updateSeller(String(id), values);
                router.push("/admin/sellers"); // Redirect after success
            } catch (error) {
                console.error("Error updating seller:", error);
            } finally {

            }
        },
    });

    if (!sellerData) return <p>Loading seller data...</p>;

    return (
        <PageContainer title="Edit Seller Details" description="Edit Seller details">
            {/* breadcrumb */}
            <Breadcrumb title="Edit Seller" />
            {/* end breadcrumb */}
            <ParentCard title="Edit Seller Details">
                {/* Page Title */}
         

                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Seller Name */}
                        <Grid item xs={12} md={4}>
                            <CustomFormLabel>Seller Name</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="seller_name"
                                name="seller_name"
                                value={formik.values.seller_name || ""}
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
                                value={formik.values.seller_mobile || ""}
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
                                value={formik.values.owner_name || ""}
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
                                value={formik.values.email || ""}
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
                                value={formik.values.address || ""}
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
                                value={formik.values.city || ""}
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
                                value={formik.values.gst_number || ""}
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
                        </Grid>

                        {/* Plan Type */}
                        <Grid item xs={12} md={4}>
                            <CustomFormLabel>Plan Type</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="plan_type"
                                name="plan_type"
                                value={formik.values.plan_type || ""}
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
                                value={formik.values.payment_status || "Pending"}
                                onChange={formik.handleChange}
                                error={formik.touched.payment_status && Boolean(formik.errors.payment_status)}
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Expired">Expired</MenuItem>
                            </CustomSelect>
                        </Grid>

                        {/* Renew Date */}
                        <Grid item xs={12} md={4}>
                            <CustomFormLabel>Renew Date</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                type="date"
                                id="renew_date"
                                name="renew_date"
                                value={formik.values.renew_date || ""}
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
                                value={formik.values.next_billing_date || ""}
                                onChange={formik.handleChange}
                                error={formik.touched.next_billing_date && Boolean(formik.errors.next_billing_date)}
                                helperText={formik.touched.next_billing_date && formik.errors.next_billing_date}
                            />
                        </Grid>

                        {/* Trial Period End */}
                        <Grid item xs={12} md={4}>
                            <CustomFormLabel>Subscibed date</CustomFormLabel>
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


                        {/* Notes */}
                        <Grid item xs={12} md={6}>
                            <CustomFormLabel>Notes</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                multiline
                                rows={3}
                                id="notes"
                                name="notes"
                                value={formik.values.notes || ""}
                                onChange={formik.handleChange}
                                error={formik.touched.notes && Boolean(formik.errors.notes)}
                                helperText={formik.touched.notes && formik.errors.notes}
                            />
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} md={4}>
                            <CustomFormLabel>Status</CustomFormLabel>
                            <CustomSelect
                                fullWidth
                                id="status"
                                name="status"
                                value={formik.values.status || "Active"}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </CustomSelect>
                        </Grid>

                    </Grid>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} mt={4}>
                        <Button variant="outlined" size="large" color="secondary" type="button" onClick={() => formik.resetForm()}>
                            Reset
                        </Button>
                        <Button variant="outlined" size="large" color="error" type="button" onClick={() => router.push("/admin/sellers")}>
                            Cancel
                        </Button>
                        <Button color="primary" size="large" variant="contained" type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Seller"}
                        </Button>
                    </Stack>
                </form>
            </ParentCard>
        </PageContainer>

    );
};

export default EditSeller;
