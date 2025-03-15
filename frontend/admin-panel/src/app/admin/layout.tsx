"use client";
import { styled, Container, Box, useTheme } from "@mui/material";
import React from "react";
import Navigation from "@/app/layout/admin_horizontal/navbar/Navigation";
import HorizontalHeader from "@/app/layout/admin_horizontal/header/Header";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  backgroundColor: "transparent",
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  return (
    <MainWrapper>
      <PageWrapper
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up("lg")]: {
              ml: `${customizer.MiniSidebarWidth}px`,
            },
          }),
        }}
      >
        <HorizontalHeader />
        <Navigation />
        <Container
          sx={{
            maxWidth: "100%!important",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
