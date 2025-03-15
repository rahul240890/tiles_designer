"use client";
import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import { Tile } from "../types";

interface FilterBarProps {
  tiles: Tile[];
  setFilteredTiles: (tiles: Tile[]) => void;
}

export default function FilterBar({ tiles, setFilteredTiles }: FilterBarProps) {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    const filtered = tiles.filter((tile) =>
      tile.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredTiles(filtered);
  };

  return (
    <Box>
      <TextField
        label="Search Tile"
        variant="outlined"
        size="small"
        value={search}
        onChange={handleSearch}
      />
    </Box>
  );
}
