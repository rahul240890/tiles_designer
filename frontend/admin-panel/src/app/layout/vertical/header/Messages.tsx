import React, { useState } from "react";
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import * as dropdownData from "./data";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { Stack } from "@mui/system";
import Link from "next/link";
import { IconMessageDots } from "@tabler/icons-react";

const Messages = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          color: anchorEl2 ? "primary.main" : "text.secondary",
        }}
        onClick={handleClick2}
      >
        <Badge variant="dot" color="primary">
          <IconMessageDots width="22" strokeWidth="1.5" />
        </Badge>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
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
            width: "385px",
          },
          "& .MuiList-padding": {
            p: "30px",
          },
        }}
      >
        <Stack direction="row" py={2} alignItems="center">
          <Typography variant="h4">Messages</Typography>
          <Box ml={2}>
            <Chip
              size="small"
              label="5 new"
              color="error"
              sx={{
                borderRadius: "6px",
                pl: "5px",
                pr: "5px",
              }}
            />
          </Box>
        </Stack>
        <Scrollbar sx={{ height: "385px" }}>
          {dropdownData.messages.map((msg, index) => (
            <Box key={index}>
              <MenuItem sx={{ py: 2, px: 0 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  display="flex"
                  alignItems="center"
                >
                  <Badge
                    variant="dot"
                    sx={{
                      ".MuiBadge-badge": {
                        backgroundColor: msg.status,
                      },
                    }}
                  >
                    <Avatar
                      src={msg.avatar}
                      alt={msg.avatar}
                      sx={{
                        width: 45,
                        height: 45,
                      }}
                    />
                  </Badge>
                  <Box>
                    <Typography
                      variant="h5"
                      color="textPrimary"
                      noWrap
                      sx={{
                        width: "240px",
                      }}
                    >
                      {msg.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      sx={{
                        width: "240px",
                      }}
                      noWrap
                    >
                      {msg.subtitle}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {msg.time}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
              <Divider
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                }}
              />
            </Box>
          ))}
        </Scrollbar>
        <Box pt={1}>
          <Button
            href="/apps/email"
            variant="contained"
            component={Link}
            color="primary"
            fullWidth
          >
            See all Messages
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Messages;
