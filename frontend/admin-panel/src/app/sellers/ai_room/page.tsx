"use client";

// Main Page Component (unchanged)
import { useState } from "react";
import RoomDesigner from "./RoomDesigner";
import { Button, Box } from "@mui/material";

export default function AI_RoomPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="white">
      <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        Open AI Room Designer
      </Button>
      {isModalOpen && <RoomDesigner onClose={() => setIsModalOpen(false)} />}
    </Box>
  );
}