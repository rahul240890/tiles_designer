import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { createAttribute } from "@/api/collectionAttributes";
import { useNotificationStore } from "@/store/notificationStore";

interface AttributeModalProps {
  open: boolean;
  onClose: () => void;
  type: "sizes" | "series" | "materials" | "finishes";
  onSuccess: (newItem: { id: string; name: string }) => void;
}

const AttributeModal: React.FC<AttributeModalProps> = ({ open, onClose, type, onSuccess }) => {
  const { showNotification } = useNotificationStore();
  const [name, setName] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  // ✅ Reset input fields when the modal opens
  useEffect(() => {
    if (open) {
      setName("");
      setLength("");
      setWidth("");
    }
  }, [open]);

  // ✅ Handle API Call to Add New Attribute
  const handleAdd = async () => {
    let attributeData;

    if (type === "sizes") {
      if (!length || !width) {
        showNotification("Length and Width are required", "error");
        return;
      }
      attributeData = { name: `${length}×${width}` };
    } else {
      if (!name) {
        showNotification("Name is required", "error");
        return;
      }
      attributeData = { name };
    }

    try {
      const newAttribute = await createAttribute(type, attributeData);
      showNotification(`${type} added successfully!`, "success");
      onSuccess(newAttribute); // ✅ Update dropdown instantly
      onClose();
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth> {/* ✅ Medium-sized modal */}
      <Box sx={{ padding: 2, borderBottom: "1px solid #ddd", backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Add {type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
      </Box>

      <DialogContent sx={{ padding: 3 }}>
        {type === "sizes" ? (
          <>
            <CustomFormLabel>Length (mm)</CustomFormLabel>
            <CustomTextField
              value={length}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLength(e.target.value)}
              placeholder="Enter Length (e.g. 300)"
              type="number" // ✅ Allows numbers & text
              fullWidth
            />
            <CustomFormLabel sx={{ mt: 2 }}>Width (mm)</CustomFormLabel>
            <CustomTextField
              value={width}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setWidth(e.target.value)}
              placeholder="Enter Width (e.g. 600)"
              type="number" // ✅ Allows numbers & text
              fullWidth
            />
          </>
        ) : (
          <>
            <CustomFormLabel>Name</CustomFormLabel>
            <CustomTextField
              value={name}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setName(e.target.value)}
              placeholder={`Enter ${type} name`}
              fullWidth
            />
          </>
        )}
      </DialogContent>

      {/* ✅ Footer with Info */}
      <Box sx={{ padding: 2, borderTop: "1px solid #ddd", backgroundColor: "#f9f9f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" sx={{ color: "#666" }}>Ensure the name is unique and meaningful.</Typography>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AttributeModal;
