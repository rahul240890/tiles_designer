"use client";

import React, { useEffect, useState } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { useNotificationStore } from "@/store/notificationStore";

const GlobalSnackbar = () => {
  const { notification, hideNotification } = useNotificationStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notification) {
      setOpen(true);
    }
  }, [notification]);

  const handleClose = () => {
    setOpen(false);
    hideNotification();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      TransitionComponent={Slide}
    >
      <Alert
        onClose={handleClose}
        severity={notification?.type}
        sx={{
          width: "100%",
          fontSize: "1rem",
          fontWeight: "bold",
          boxShadow: 3,
        }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
