"use client";

import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useDropzone, Accept } from "react-dropzone";
import { IconPhoto, IconUpload } from "@tabler/icons-react";

interface BulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[], thickness: string) => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ open, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thickness, setThickness] = useState<string>("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] } as Accept,
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const handleUpload = () => {
    onUpload(selectedFiles, thickness);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 600, bgcolor: "white", p: 3, m: "auto", mt: "5%", borderRadius: 2, maxHeight: "80vh", overflowY: "auto" }}>
        <Typography variant="body1" sx={{ color: "gray", mb: 1, textAlign: "center" }}>
          The thickness you set here will apply to all tiles initially. You can modify individual tile thicknesses later.
        </Typography>

        <Typography variant="h6" fontWeight="bold">Upload Tile Images</Typography>
        <TextField fullWidth label="Tile Thickness (mm)" sx={{ mt: 2 }} value={thickness} onChange={(e) => setThickness(e.target.value)} />
        <Typography sx={{ mt: 1 }}>Selected Images: {selectedFiles.length}</Typography>

        <Box {...getRootProps()} sx={{ border: "2px dashed gray", p: 3, textAlign: "center", cursor: "pointer", mt: 2 }}>
          <input {...getInputProps()} />
          <Typography>Drag & Drop tiles here or click to select files</Typography>
        </Box>

        <Box sx={{ maxHeight: "100px", overflowY: "auto", mt: 2, display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {selectedFiles.map((file, index) => (
            <Box key={index} sx={{ width: 50, height: 50, border: "1px solid gray", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
              <IconPhoto size={24} />
            </Box>
          ))}
        </Box>

        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpload}>Proceed</Button>
      </Box>
    </Modal>
  );
};

export default BulkUploadModal;