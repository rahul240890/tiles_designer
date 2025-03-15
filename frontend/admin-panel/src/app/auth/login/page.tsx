import { Metadata } from "next";
import { Box, Grid, Card, Typography, Stack } from "@mui/material";
import Logo from "@/app/layout/shared/logo/Logo";
import PageContainer from "@/app/components/container/PageContainer";
import Link from "next/link";
import AuthLogin from "./AuthLogin"; // ✅ Importing Client Component

export const metadata: Metadata = {
  title: "Login Page",
  description: "Admin & Seller Login Page",
};

export default function LoginPage() {
  return (
    <PageContainer title="Login Page" description="Login for Admin & Seller">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
          <Grid display="flex" justifyContent="center" alignItems="center" xs={12} sm={12} lg={5} xl={4}>
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "450px" }}>
              <Box display="flex" alignItems="center" justifyContent="center" textAlign="center">
                <Logo />
              </Box>
              <AuthLogin /> {/* ✅ Calls the Client Component */}
              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography
                  component={Link}
                  href="/auth/forget-password"
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  Forgot Password?
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
