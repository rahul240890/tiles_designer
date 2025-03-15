"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import TileForm from "../components/TileForm";
import { useRouter } from "next/navigation";
import { Tile } from "../types";
import { createTile } from "../../api/tile";

export default function AddTilePage() {
  const router = useRouter();

  const handleSubmit = async (tileData: Omit<Tile, "id">) => {
    try {
      await createTile(tileData);
      router.push("/company/tiles/list"); // Redirect after successful submission
    } catch (error) {
      console.error("Failed to create tile:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Add New Tile</Typography>
      <Paper sx={{ p: 3 }}>
        <TileForm onSubmit={handleSubmit} />
      </Paper>
    </Box>
  );
}
