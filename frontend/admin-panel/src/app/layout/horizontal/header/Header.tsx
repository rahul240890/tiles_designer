"use client";

import * as React from "react";
import {
  IconButton,
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  Theme,
  useMediaQuery,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "@/store/hooks";
import { toggleMobileSidebar } from "@/store/customizer/CustomizerSlice";
import { AppState } from "@/store/store";
import { IconMenu2, IconBell, IconSettings, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const router = useRouter();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    minHeight: "40px !important",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    position: "sticky",
    top: 0,
    zIndex: 1100,
    fontFamily: "'Roboto', sans-serif",
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: "0 auto",
    width: "100%",
    color: `${theme.palette.text.secondary} !important`,
    minHeight: "40px !important",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Roboto', sans-serif",
  }));

  const handleLogout = () => {
    router.push("/logout");
  };

  return (
    <AppBarStyled position="sticky" color="default" elevation={0}>
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
        }}
      >
        {/* Left Side: Company Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: lgDown ? "16px" : "18px", // Slightly smaller on mobile
            color: "text.primary",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          TileCorp
        </Typography>

        {/* Mobile Sidebar Toggle */}
        {lgDown && (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleMobileSidebar())}
            sx={{ p: "6px", ml: 1 }}
          >
            <IconMenu2 size="20" strokeWidth="1.5" />
          </IconButton>
        )}

        {/* Spacer */}
        <Box flexGrow={1} />

        {/* Right Side: Profile with Buttons */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Notifications Button */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ p: "6px" }}>
              <IconBell size="20" strokeWidth="1.5" />
            </IconButton>
          </Tooltip>

          {/* Settings Button */}
          <Tooltip title="Settings">
            <IconButton color="inherit" sx={{ p: "6px" }}>
              <IconSettings size="20" strokeWidth="1.5" />
            </IconButton>
          </Tooltip>

          {/* Logout Button */}
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ p: "6px" }}
            >
              <IconLogout size="20" strokeWidth="1.5" />
            </IconButton>
          </Tooltip>

          {/* Profile Placeholder */}
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              bgcolor: "grey.300",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            U {/* Placeholder for user initial */}
          </Box>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;