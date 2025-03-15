import * as React from "react";
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
  Theme,
} from "@mui/material";
import { useSelector, useDispatch } from "@/store/hooks";
import { toggleMobileSidebar, setDarkMode } from "@/store/customizer/CustomizerSlice";
import Notifications from "../../vertical/header/Notification";
import Messages from "../../vertical/header/Messages";

import Profile from "../../vertical/header/Profile";
import Search from "../../vertical/header/Search";
import Logo from "../../shared/logo/Logo";
import { AppState } from "@/store/store";
import Language from "../../vertical/header/Language";
import { IconMenu2, IconMoon, IconShoppingCart, IconSun } from "@tabler/icons-react";

const Header = () => {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",

    [theme.breakpoints.up("lg")]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: "0 auto",
    width: "100%",
    color: `${theme.palette.text.secondary} !important`,
  }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
        }}
      >
        <Box sx={{ width: lgDown ? "40px" : "auto", overflow: "hidden" }}>
          <Logo />
        </Box>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        {lgDown ? (
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleMobileSidebar())}
          >
            <IconMenu2 size="22" height="22" strokeWidth="1.5" />
          </IconButton>
        ) : (
          ""
        )}
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <Search />
        {lgUp ? <>{/* <Navigation /> */}</> : null}

        <Box flexGrow={1} />
        <Stack direction="row" alignItems="center">

          

         

          <Messages />

          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          <Notifications />
          {/* ------------------------------------------- */}

          <Box
            sx={{
              width: "1px",
              backgroundColor: "rgba(0,0,0,0.1)",
              height: "25px",
              ml: 1,
              mr: 1,
            }}
          />

          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
