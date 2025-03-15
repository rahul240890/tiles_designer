import React from "react";
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "@/store/hooks";
import {
  toggleSidebar,
  toggleMobileSidebar, setDarkMode
} from "@/store/customizer/CustomizerSlice";
import Notifications from "./Notification";
import Messages from "./Messages";
import Profile from "./Profile";
import Search from "./Search";
import { AppState } from "@/store/store";
import { IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";

const Header = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.default,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={
            lgUp
              ? () => dispatch(toggleSidebar())
              : () => dispatch(toggleMobileSidebar())
          }
        >
          <IconMenu2 size="22" height="22" strokeWidth="1.5" />
        </IconButton>

        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <Search />

        <Box flexGrow={1} />
        <Stack direction="row" alignItems="center">
      

         
          <Notifications />

          <Messages />

          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
         
          {/* ------------------------------------------- */}

          <Box
            mx={1}
            sx={{
              width: "1px",
              backgroundColor: "rgba(0,0,0,0.1)",
              height: "25px",
            }}
          />

          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
