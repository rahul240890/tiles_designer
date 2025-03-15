"use client";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";

import { Stack } from "@mui/system";
import {
  IconChevronDown,
  IconCreditCard,
  IconCurrencyDollar,
  IconMail,
  IconShield,
} from "@tabler/icons-react";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const router = useRouter();
  
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("role");
    router.push("/business/login");
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;

  /*profile data*/
  const profiledata = [
    {
      href: "/",
      title: "My Profile",
      subtitle: "Account Settings",
      icon: <IconCurrencyDollar width="20" height="20" />,
      color: primary,
      lightcolor: primarylight,
    },
    {
      href: "/",
      title: "My Inbox",
      subtitle: "Messages & Emails",
      icon: <IconShield width="20" height="20" />,
      color: success,
      lightcolor: successlight,
    },
    {
      href: "/",
      title: "My Tasks",
      subtitle: "To-do and Daily Tasks",
      icon: <IconCreditCard width="20" height="20" />,
      color: error,
      lightcolor: errorlight,
    },
  ];

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            borderRadius: "9px",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/users/user2.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 30,
            height: 30,
          }}
        />
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
            alignItems: "center",
          }}
        >
          <Typography
            color="textSecondary"
            variant="h5"
            fontWeight="400"
            sx={{ ml: 1 }}
          >
            Hi,
          </Typography>
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{
              ml: 1,
            }}
          >
            Julia
          </Typography>
          <IconChevronDown width="20" height="20" />
        </Box>
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
            pb: 2,
          },
        }}
      >
        <Typography variant="h4">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={"/images/users/user2.jpg"}
            alt={"ProfileImg"}
            sx={{ width: 95, height: 95 }}
          />
          <Box>
            <Typography variant="h4" color="textPrimary">
              Julia Roberts
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Administrator
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width="18" height="18" />
              info@flexy.com
            </Typography>
          </Box>
        </Stack>
        <Divider />

        {profiledata.map((prf) => (
          <Box key={prf.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={prf.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                    sx={{
                      bgcolor: prf.lightcolor,
                      color: prf.color,
                      boxShadow: "none",
                      minWidth: "50px",
                      width: "45px",
                      height: "40px",
                      borderRadius: "10px",
                    }}
                  >
                    {prf.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" className="text-hover" color="textPrimary" noWrap>
                      {prf.title}
                    </Typography>
                    <Typography color="textSecondary" variant="h6" noWrap>
                      {prf.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
            <Divider />
          </Box>
        ))}
        <Box mt={2}>
          <Button variant="contained" color="primary" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
