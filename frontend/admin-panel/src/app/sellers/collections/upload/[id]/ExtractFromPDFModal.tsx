"use client";

import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

interface ExtractFromPDFModalProps {
  open: boolean;
  onClose: () => void;
}

const ExtractFromPDFModal: React.FC<ExtractFromPDFModalProps> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 600, bgcolor: "white", p: 3, m: "auto", mt: "5%", borderRadius: 2, maxHeight: "80vh", overflowY: "auto" }}>
        <Typography variant="h6" fontWeight="bold">Extract from PDF</Typography>
        <Typography sx={{ mt: 1 }}>This feature is under development.</Typography>
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ExtractFromPDFModal;