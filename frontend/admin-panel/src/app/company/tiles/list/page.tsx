"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { IconList, IconGridDots } from "@tabler/icons-react";
import { Tile } from "../types"; 
import { activateTile, deactivateTile, deleteTile, getTiles } from "../../api/tile";
import FilterBar from "../components/FilterBar";
import TileCard from "../components/TileCard";
import TileTable from "../components/TileTable";


export default function TileListPage() {
  const router = useRouter();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [viewMode, setViewMode] = useState<string>("table");
  const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getTiles();
      setTiles(data);
      setFilteredTiles(data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTile(id);
    setTiles(tiles.filter((tile) => tile.id !== id));
  };

  const handleActivate = async (id: number) => {
    await activateTile(id);
    setTiles(tiles.map((tile) => (tile.id === id ? { ...tile, status: "Active" } : tile)));
  };

  const handleDeactivate = async (id: number) => {
    await deactivateTile(id);
    setTiles(tiles.map((tile) => (tile.id === id ? { ...tile, status: "Inactive" } : tile)));
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Manage Tiles</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <FilterBar tiles={tiles} setFilteredTiles={setFilteredTiles} />
        <Box>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(e, newMode) => setViewMode(newMode)}>
            <ToggleButton value="table"><IconList /></ToggleButton>
            <ToggleButton value="grid"><IconGridDots /></ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => router.push("/company/tiles/add")}>
            Add New Tile
          </Button>
        </Box>
      </Box>

      {viewMode === "table" ? (
        <TileTable tiles={filteredTiles} onDelete={handleDelete} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      ) : (
        <TileCard tiles={filteredTiles} onDelete={handleDelete} onActivate={handleActivate} onDeactivate={handleDeactivate} />
      )}
    </Box>
  );
}
